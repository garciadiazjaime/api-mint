const {
  GraphQLObjectType,
  GraphQLSchema,
} = require('graphql/type');

const { query: todoQuery, mutation: todoMutation } = require('./todo')
const { query: portQuery, mutation: portMutation } = require('./port')
const { query: realStateQuery, mutation: realStateMutation } = require('./realState')


const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...todoQuery,
    ...portQuery,
    ...realStateQuery
  },
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...todoMutation,
    ...portMutation,
    ...realStateMutation
  }
})

const schema = new GraphQLSchema({
  query,
  mutation
});

module.exports = schema;
