import faker from 'faker';
import GraphQLBuilder from './builders/GraphQLBuilder';

const response = {
  creditCard: faker.helpers.createCard(),
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
};

const visitor = new GraphQLBuilder(response);
const schema = visitor.generateSchema();

schema.forEach((file) => {
  console.log(file);
});

