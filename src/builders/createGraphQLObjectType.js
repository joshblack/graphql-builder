import * as t from 'babel-types';

const pascalCase = (word) => {
  const [first, ...rest] = word;

  return first.toUpperCase() + rest.join('');
};

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

export const createGraphQLObjectType = ({
  name,
  fields,
}) => t.variableDeclaration(
  'const',
  [
    t.variableDeclarator(
      t.identifier(`${name}Type`),
      t.NewExpression(
        t.identifier('GraphQLObjectType'),
        [
          t.ObjectExpression([
            t.objectProperty(
              t.identifier('name'),
              t.stringLiteral(`${pascalCase(name)}Type`),
            ),
            t.objectProperty(
              t.identifier('description'),
              t.stringLiteral(`Generated description for ${name}`),
            ),
            t.objectProperty(
              t.identifier('fields'),
              t.ObjectExpression(fields),
            )
          ]),
        ],
      ),
    ),
  ],
);
