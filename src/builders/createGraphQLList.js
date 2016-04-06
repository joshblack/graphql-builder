import i from 'i';
import * as t from 'babel-types';
import { isPlainObject } from 'lodash';
import invariant from 'fbjs/lib/invariant';
import GraphQLBuilder from './GraphQLBuilder';
import {
  inferGraphQLScalarTypeFrom
} from '../utilities/inferGraphQLScalarTypeFrom';

const inflect = i(true);

export function getListType({ moduleMap, name, value }) {
  let dependencies = [];

  // Support union types for sets with more than one distinct type
  const typeList = value.reduce((acc, item) => {
    if (isPlainObject(item)) {
      let itemName = inflect.singularize(name);

      if (itemName === name) {
        itemName = `${name}Item`;
      }

      const visitor = new GraphQLBuilder({
        [itemName]: item,
      });

      moduleMap[itemName] = visitor._moduleMap[itemName];
      dependencies = dependencies.concat({
        name: `${itemName}Type`,
        source: `./${itemName}`,
      });

      return acc.concat(itemName);
    } else if (Array.isArray(item)) {
      invariant(
        'Nested lists inside of lists is not currently supported in the ' +
        'GraphQLBuilder.',
      );
    } else {
      const type = inferGraphQLScalarTypeFrom(item);

      if (acc.indexOf(type) === -1) {
        dependencies = dependencies.concat({
          name: type,
          source: 'graphql',
        });

        return acc.concat(type);
      }
    }

    return acc;
  }, []);
  const [type] = typeList;

  return {
    type,
    dependencies: [
      {
        name: 'GraphQLList',
        source: 'graphql',
      },
      ...dependencies,
    ],
  };
};

export function createGraphQLList({ moduleMap, name, value }) {
  const { type, dependencies } = getListType({ moduleMap, name, value });
  const definition = t.objectProperty(
    t.identifier(name),
    t.objectExpression([
      t.objectProperty(
        t.identifier('type'),
        t.NewExpression(
          t.identifier('GraphQLList'),
          [t.identifier(`${type}Type`)],
        ),
      ),
      t.objectProperty(
        t.identifier('description'),
        t.stringLiteral(`Generated type for ${name}.`),
      ),
    ]),
  );

  return {
    definition,
    dependencies,
  };
};
