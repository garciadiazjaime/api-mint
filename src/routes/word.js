var express = require('express');
var graphqlHTTP = require('express-graphql');

const wordsSchema = require('../schema/word')

const router = express.Router()

router.use('/word/graphiql', graphqlHTTP({
  schema: wordsSchema,
  graphiql: true,
}));

module.exports = router
