import path from 'path';
import { promisify } from 'bluebird';
import { ensureDir, emptyDir, writeFile } from 'fs-extra';
import generate from 'babel-generator';

const emptyDirAsync = promisify(emptyDir);
const ensureDirAsync = promisify(ensureDir);
const writeFileAsync = promisify(writeFile);

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

  ensureDirAsync(destination)
    .then(() => emptyDirAsync(destination))
    .then(() => Promise.all(
      files.map(({ name, source }) => writeFileAsync(
        path.resolve(destination, `${name}.js`),
        source,
        'utf-8',
      )),
    ))
    .catch((error) => console.log(error));
};
