import * as t from 'babel-types';

export const createImportSpecifiers = ({ dependencies }) => {
  // Group dependencies that come from the same source
  const imports = dependencies.reduce((acc, dependency) => {
    const { name, source } = dependency;

    // If we already have an import from this source, and we haven't already
    // included this import, then add it to the list of imports from
    // the given source
    if (acc[source]) {
      if (acc[source].indexOf(name) === -1) {
        return {
          ...acc,
          [source]: acc[source].concat(name),
        };
      }

      return acc;
    }

    return {
      ...acc,
      [source]: [name],
    };
  }, {});

  return Object.keys(imports).map((key) => t.importDeclaration(
    imports[key].map((name) => t.importSpecifier(
      t.identifier(name),
      t.identifier(name),
    )),
    t.stringLiteral(key)),
  );
};
