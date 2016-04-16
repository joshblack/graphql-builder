import path from 'path';
import faker from 'faker';
import GraphQLBuilder from './builders/GraphQLBuilder';
import { scaffold } from './scaffold';

visitURLs([
  'someurl',
  {
    uri: 'someurl',
    username: 'user',
    password: 'pass',
  },
  {
    uri: 'someuri',
    token: 'asdf',
  },
]);


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

const visitor = new GraphQLBuilder(response);
scaffold(visitor.schema, path.resolve(__dirname, '../project'));

console.log('done');

