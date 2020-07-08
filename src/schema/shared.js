const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
} = require('graphql/type');

function getType(name, fields) {
  const config = {
    name,
    fields
  }

  if (name.includes('Input')) {
    return new GraphQLInputObjectType(config);
  }

  return new GraphQLObjectType(config);
}

function getGpsType(type) {
  const name = `GPS${type}`
  const fields = () => ({
    type: {
      type: GraphQLString
    },
    coordinates: {
      type: GraphQLList(GraphQLFloat)
    },
  })
  
  return getType(name, fields)
}

function getAddressType(type) {
  const name = `Address${type}`
  const fields = () => ({
    _id: {
      type: GraphQLString
    },
    street: {
      type: GraphQLString
    },
    zipCode: {
      type: GraphQLString
    },
    city: {
      type: GraphQLString
    },
    country: {
      type: GraphQLString
    }
  })
  
  return getType(name, fields)
}

module.exports = {
  getType,
  getGpsType,
  getAddressType
}
