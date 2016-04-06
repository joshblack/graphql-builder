import {
  isString,
  isInteger,
  isNumber,
  isBoolean,
} from 'lodash';

export const inferGraphQLScalarTypeFrom = (value) => {
  if (isNumber(value)) {
    if (isInteger(value)) {
      return 'GraphQLInt';
    };

    return 'GraphQLFloat';
  }

  if (isBoolean(value)) {
    return 'GraphQLBoolean';
  }

  if (isString(value)) {
    return 'GraphQLString';
  }

  // Coerce to string :/
  if (value instanceof Date) {
    return 'GraphQLString';
  }
};
