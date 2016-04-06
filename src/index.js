import path from 'path';
import faker from 'faker';
import GraphQLBuilder from './builders/GraphQLBuilder';
import { scaffold } from './scaffold';

  // user: {
    // friends: [user]
    // name: faker.name.findName(),
    // contact: {
      // email: faker.internet.email(),
      // apartment: {
        // name: faker.name.findName(),
      // },
    // },
  // },

const response = {
  creditCard: faker.helpers.createCard(),
  // user: {
    // name: 'josh',
    // bar: ['a', 'b', 'c'],
  // },
};
// console.log(JSON.stringify(response, null, 2));
const visitor = new GraphQLBuilder(response);

// Object.keys(visitor._moduleMap).forEach((m) => {
  // console.log(m);
  // console.log(visitor._moduleMap[m].dependencies);
// });


// import generate from 'babel-generator';
// const files = visitor.schema.map((type) => {
  // const { name, program } = type;
  // const { code } = generate(program, {
    // quotes: 'single'
  // });

  // return {
    // name,
    // source: code,
  // };
// });

// files.forEach((file) => {
  // console.log(file.source);
// });

// scaffold(visitor.schema, path.resolve(__dirname, '../project'));

