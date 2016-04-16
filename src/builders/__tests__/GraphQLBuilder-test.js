import { expect } from 'chai';
import { describe, it } from 'mocha';
import GraphQLBuilder from '../GraphQLBuilder';

import generate from 'babel-generator';

describe('GraphQLBuilder', () => {
  it('should build one module for a response with single-level depth', () => {
    const response = {
      user: {
        name: 'Test',
      },
    };

    const builder = new GraphQLBuilder(response);
    const schema = builder._schema;
    const { fields } = schema;

    expect(fields.length).to.equal(1);

    const user = fields[0];

    expect(user.fields.length).to.equal(1);

    const nameField = user.fields[0];

    expect(nameField.name).to.equal('name');
    expect(nameField.type).to.equal('GraphQLString');
  });

  it('should work with nested objects in the response', () => {
    const response = {
      user: {
        name: 'Test',
        contact: {
          email: 'test@test.com',
        },
      },
    };

    const builder = new GraphQLBuilder(response);
    const schema = builder._schema;

    const { fields } = schema;

    expect(fields.length).to.equal(1);

    const user = fields[0];

    expect(user.fields.length).to.equal(2);

    const [nameField, contactField] = user.fields;

    expect(nameField.name).to.equal('name');
    expect(nameField.type).to.equal('GraphQLString');
    expect(contactField.type).to.equal('GraphQLObjectType');
    expect(contactField.fields.length).to.equal(1);
  });

  it('should work with lists of primitives in the response', () => {
    const response = {
      user: {
        aliases: ['Josh', 'Abbey', 'Sora'],
      },
    };

    const builder = new GraphQLBuilder(response);
    const schema = builder._schema;

    const { fields } = schema;
    const [userField] = fields;

    expect(userField.name).to.equal('user');
    expect(userField.type).to.equal('GraphQLObjectType');

    const [aliasesField] = userField.fields;

    expect(aliasesField.name).to.equal('aliases');
    expect(aliasesField.type).to.equal('GraphQLList');
  });

  it('should resolve lists that refer to the same type', () => {
    const response = {
      visitor: {
        user: {
          name: 'Josh',
          friends: [
            { name: 'Abbey' },
            { name: 'Lee Byron' },
          ],
        },
      },
    };

    const builder = new GraphQLBuilder(response);
    const schema = builder._schema;
    const { fields } = schema;
    const [visitor] = fields;
    const [userField, friendsField] = visitor.fields;
  });
});
