import * as t from 'babel-types';
import {
  inferGraphQLScalarTypeFrom
} from '../utilities/inferGraphQLScalarTypeFrom';

export const createGraphQLPrimitive = ({
  name,
  value
}) => t.objectProperty(
  t.identifier(name),
  t.ObjectExpression([
    t.objectProperty(
      t.identifier('type'),
      t.identifier(inferGraphQLScalarTypeFrom(value)),
    ),
    t.objectProperty(
      t.identifier('description'),
      t.stringLiteral(`Generated description for ${name}`),
    ),
  ])
);

