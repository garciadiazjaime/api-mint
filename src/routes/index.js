var express = require('express');
var graphqlHTTP = require('express-graphql');

const schema = require('../schema')
const config = require('../config')

const router = express.Router()

router.use('/graphiql', graphqlHTTP({
  schema,
  graphiql: config.get('env') !== 'production',
}));

module.exports = router
