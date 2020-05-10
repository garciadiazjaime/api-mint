var express = require('express');
var graphqlHTTP = require('express-graphql');

const schema = require('../schema')

const router = express.Router()

router.use('/graphiql', graphqlHTTP({
  schema,
  graphiql: true,
}));

module.exports = router
