import * as t from 'babel-types';

export const createGraphQLList = ({
  name,
  type,
}) => t.objectProperty(
  t.identifier(name),
  t.NewExpression(t.identifier('GraphQLList'), [type]),
);
