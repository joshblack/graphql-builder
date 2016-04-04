import path from 'path';
import { promisify } from 'bluebird';
import { ensureDir, emptyDir, writeFile } from 'fs-extra';
import generate from 'babel-generator';

const emptyDirAsync = promisify(emptyDir);
const ensureDirAsync = promisify(ensureDir);
const writeFileAsync = promisify(writeFile);

// given an AST with additional info like filename,
// write files to a target directory

export const scaffold = (types, destination) => {
  const files = types.map((type) => {
    const { name, program } = type;
    const { code } = generate(program, {
      quotes: 'single'
    });

    return {
      name,
      source: code,
    };
  });

  const targetFile = path.resolve(destination, 'sample.js');

  ensureDirAsync(destination)
    .then(() => emptyDirAsync(destination))
    .then(() => Promise.all(
      files.map(({ name, source }) => writeFileAsync(
        path.resolve(destination, `${name}.js`),
        source,
        'utf-8',
      )),
    ))
    .then(() => console.log('done'))
    .catch((error) => console.log(error));
};
