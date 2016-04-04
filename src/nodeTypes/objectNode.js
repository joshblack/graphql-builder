export const objectNode = ({
  name,
  parent,
  fields = [],
  definition
}) => ({
  name,
  type: 'GraphQLObjectType',
  fields,
  parent,
  definition,
  dependencies: [
    {
      name: 'GraphQLObjectType',
      source: 'graphql',
    },
  ],
});
