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
};

console.log(response.creditCard);

const visitor = new GraphQLBuilder(response);

scaffold(visitor.schema, path.resolve(__dirname, '../project'));

