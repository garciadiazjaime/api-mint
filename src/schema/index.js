const {
  GraphQLObjectType,
  GraphQLSchema,
} = require('graphql/type');

const { query: todoQuery, mutation: todoMutation } = require('./todo')


const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...todoQuery
  },
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...todoMutation
  }
})

const schema = new GraphQLSchema({
  query,
  mutation
});

module.exports = schema;
