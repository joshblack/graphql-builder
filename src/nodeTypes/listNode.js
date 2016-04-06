import { createGraphQLList } from '../builders/createGraphQLList';

export const listNode = ({
  name,
  value,
  parent,
  moduleMap,
}) => {
  const { definition, dependencies } = createGraphQLList({
    name,
    value,
    moduleMap,
  });

  return {
    name,
    value,
    type: 'GraphQLList',
    parent,
    definition,
    dependencies,
  }
};
