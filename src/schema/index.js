const {
  GraphQLObjectType,
  GraphQLSchema,
} = require('graphql/type');

const { query: todoQuery, mutation: todoMutation } = require('./todo')
const { query: portQuery, mutation: portMutation } = require('./port')


const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...todoQuery,
    ...portQuery,
  },
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...todoMutation,
    ...portMutation,
  }
})

const schema = new GraphQLSchema({
  query,
  mutation
});

module.exports = schema;
