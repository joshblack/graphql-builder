import * as t from 'babel-types';

export const createGraphQLObjectReferenceField = ({ name, type }) => t.objectProperty(
  t.identifier(name),
  t.ObjectExpression([
    t.objectProperty(
      t.identifier('type'),
      t.identifier(type),
    ),
    t.objectProperty(
      t.identifier('description'),
      t.stringLiteral(`Generated description for ${name}`),
    ),
  ])
);
