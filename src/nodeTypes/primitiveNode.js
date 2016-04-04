import { createGraphQLPrimitive } from '../builders/createGraphQLPrimitive';
import {
  inferGraphQLScalarTypeFrom
} from '../utilities/inferGraphQLScalarTypeFrom';

export const primitiveNode = ({ name, value, parent }) => ({
  name,
  value,
  type: inferGraphQLScalarTypeFrom(value),
  parent,
  definition: createGraphQLPrimitive({
    name,
    value,
  }),
  dependencies: [
    {
      name: inferGraphQLScalarTypeFrom(value),
      source: 'graphql',
    },
  ],
});
