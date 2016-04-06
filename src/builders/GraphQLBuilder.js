import * as t from 'babel-types';
import { isPlainObject } from 'lodash';
import invariant from 'fbjs/lib/invariant';

import { createGraphQLPrimitive } from './createGraphQLPrimitive';
import { createImportSpecifiers } from './createImportSpecifiers';
import { createGraphQLObjectType } from './createGraphQLObjectType';
import {
  inferGraphQLScalarTypeFrom,
} from '../utilities/inferGraphQLScalarTypeFrom';
import {
  createGraphQLObjectReferenceField,
} from './createGraphQLObjectReferenceField';

import { listNode } from '../nodeTypes/listNode';
import { objectNode } from '../nodeTypes/objectNode';
import { primitiveNode } from '../nodeTypes/primitiveNode';

const SOURCE_PATH = (type) => `./${type}`;

export default class GraphQLBuilder {
  constructor(node) {
    this._schema = objectNode({ name: 'root' });
    this._visitor = this._schema;
    this._moduleMap = {};

    this.visit(node);
  }

  visit(node) {
    // Cases (as-is) is either a GraphQLObject, GraphQLList, or GraphQLScalar

    // TODO: how to check if `id`, `_id`, for GraphQLID
    Object.keys(node).forEach((key) => {
      const value = node[key];

      if (isPlainObject(value)) {
        this.push(key);
        this.visit(value);
        this.pop();
      } else if (Array.isArray(value)) {
        const field = listNode({
          name: key,
          value,
          parent: this._visitor,
          moduleMap: this._moduleMap,
        });

        this._visitor.fields = this._visitor.fields.concat(field);
        this._visitor.dependencies = this._visitor.dependencies.concat(
          field.dependencies,
        );
      } else {
        invariant(
          this._visitor.type === 'GraphQLObjectType',
          'Undesired state, current visitor is not a GraphQLObject, instead ' +
          'it is: %s',
          this._visitor.type,
        );

        const field = primitiveNode({
          name: key,
          value,
          parent: this._visitor,
        });

        if (typeof field.type === 'undefined') {
          console.log(field);
        }

        this._visitor.fields = this._visitor.fields.concat(field);
        this._visitor.dependencies = this._visitor.dependencies.concat(
          {
            name: field.type,
            source: 'graphql',
          },
        );
      }
    });
  }

  push(key) {
    const field = objectNode({ name: key, parent: this._visitor });

    this._moduleMap[key] = field;

    this._visitor.fields = this._visitor.fields.concat(field);
    this._visitor = field;
  }

  pop() {
    const { name, fields, parent } = this._visitor;
    const GraphQLFields = fields.map((field) => {
      if (field.type === 'GraphQLObjectType') {
        const { name, definition } = field;
        const type = definition.declarations[0].id.name;
        const reference = createGraphQLObjectReferenceField({
          name,
          type,
        });

        this._visitor.dependencies = this._visitor.dependencies.concat({
          name: type,
          source: SOURCE_PATH(name),
        });

        return reference;
      }

      return field.definition;
    });

    this._visitor.definition = createGraphQLObjectType({
      name,
      fields: GraphQLFields,
    });
    this._visitor = parent;
  }

  get schema() {
    const types = Object.keys(this._moduleMap)
      .map((key) => {
        const { name, definition, dependencies } = this._moduleMap[key];

        return {
          name,
          program: t.Program([
            ...createImportSpecifiers({ dependencies }),
            t.exportNamedDeclaration(definition, []),
          ]),
        };
      });

    return types;
  }
}
