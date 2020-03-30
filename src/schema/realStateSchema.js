const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat
} = require('graphql/type');

const RealStateModel = require('../model/realStateModel');

const PlaceType = new GraphQLObjectType({
  name: 'Place',
  fields: () => ({
    _id: {
      type: GraphQLString,
    },
    price: {
      type: GraphQLFloat,
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
    images: {
      type: new GraphQLList(GraphQLString)
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

function getQuery(city, minPrice, maxPrice, keyword) {
  const query = {}

  if (minPrice || maxPrice) {
    query.price = {}

    if (minPrice) {
      query.price['$gte'] = minPrice
    }

    if (maxPrice) {
      query.price['$lte'] = maxPrice
    }
  }

  if (city) {
    query.city = city
  }

  if (keyword) {
    query['$text'] = {$search: keyword}
  }

  return query
}

function convertToUSD(item) {
  if (item.currency === "USD") {
    return item;
  }

  const rate = 22;

  item.currency = "USD";
  item.price = Math.round(item.price / rate);

  return item;
}

function sortByPrice(data) {
  return data.map(convertToUSD).sort((a, b) => a.price - b.price);
}

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
          },
          city: {
            type: GraphQLString
          },
          minPrice: {
            type: GraphQLFloat
          },
          maxPrice: {
            type: GraphQLFloat
          },
          keyword: {
            type: GraphQLString
          }
        },
        resolve: async (root, {_id, first = 50, city, minPrice, maxPrice, keyword}) => {
          const query = getQuery(city, minPrice, maxPrice, keyword)
          const items = await RealStateModel.find(query).sort('-updatedAt').limit(first);

          const sortedItems = sortByPrice(items);

          return sortedItems
        },
      },
    },
  }),
});

module.exports = realStateSchema;
