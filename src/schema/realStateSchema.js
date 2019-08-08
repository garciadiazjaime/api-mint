const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} = require('graphql/type');

const RealStateModel = require('../model/realStateModel');

const PlaceType = new GraphQLObjectType({
  name: 'Place',
  fields: () => ({
    _id: {
      type: GraphQLString,
    },
    price: {
      type: GraphQLString,
    },
    currency: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString
    },
    latitude: {
      type: GraphQLString
    },
    longitude: {
      type: GraphQLString
    },
    image: {
      type: GraphQLString
    },
    url: {
      type: GraphQLString
    },
    address: {
      type: GraphQLString
    },
    city: {
      type: GraphQLString
    },
    source: {
      type: GraphQLString
    },
    createdAt: {
      type: GraphQLString
    },
    updatedAt: {
      type: GraphQLString
    }
  }),
});

const realStateSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      places: {
        type: new GraphQLList(PlaceType),
        args: {
          _id: {
            name: '_id',
            type: GraphQLString,
          },
          first: {
            type: GraphQLInt
          }
        },
        resolve: async (root, { first = 50, _id }) => {
          const query = _id ? { _id } : {};
          const items = await RealStateModel.find(query).sort('-updatedAt').limit(first);

          return items
        },
      },
    },
  }),
});

module.exports = realStateSchema;
