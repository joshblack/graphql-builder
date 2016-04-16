import {
  isString,
  isInteger,
  isNumber,
  isBoolean,
} from 'lodash';

const inferGraphQLNumericType = (value) => {
  if (isInteger(value)) {
    return 'GraphQLInt';
  };

  return 'GraphQLFloat';
};

export const inferGraphQLScalarTypeFrom = (value) => {
  if (isNumber(value)) {
    return inferGraphQLNumericType(value);
  }

  if (isString(value)) {
    return 'GraphQLString';
  }

  if (isBoolean(value)) {
    return 'GraphQLBoolean';
  }

  // Coerce to string :/
  if (value instanceof Date) {
    return 'GraphQLString';
  }
};
