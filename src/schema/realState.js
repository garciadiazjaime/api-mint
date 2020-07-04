const {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull
} = require('graphql/type');

const RealStateModel = require('../model/realStateModel');
const { gpsType } = require('./shared')

const commonFields = {
  price: {
    type: GraphQLFloat,
  },
  currency: {
    type: GraphQLString,
  },
  description: {
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
}

const RealStateType = new GraphQLObjectType({
  name: 'RealState',
  fields: () => ({
    _id: {
      type: GraphQLString,
    },
    ...commonFields,
    location: {
      type: gpsType
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
    query['$text'] = {
      $search: keyword
    }
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


const query = {
  realState: {
    type: new GraphQLList(RealStateType),
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
      },
      coordinates: {
        type: GraphQLList(GraphQLFloat)
      },
    },
    resolve: async (root, {
      _id,
      first = 50,
      city,
      minPrice,
      maxPrice,
      keyword
    }) => {
      const query = getQuery(city, minPrice, maxPrice, keyword)
      const items = await RealStateModel.find(query).sort('-updatedAt').limit(first);

      const sortedItems = sortByPrice(items);

      return sortedItems
    },
  }
}

const gpsInputType = new GraphQLInputObjectType({
  name: 'GPSInput',
  fields: () => ({
    type: {
      type: GraphQLString
    },
    coordinates: {
      type: GraphQLList(GraphQLFloat)
    },
  }),
});

const RealStateInput = new GraphQLInputObjectType({
  name: 'RealStateInput',
  fields: () => ({
    ...commonFields,
    gps: {
      type: gpsInputType
    },
  }),
})

const MutationAdd = {
  type: RealStateType,
  args: {
    data: {
      type: new GraphQLNonNull(GraphQLList(RealStateInput))
    },
  },
  resolve: async (root, args) => {
    const {
      data
    } = args

    if (!Array.isArray(data) || !data.length) {
      return new Error('ERROR_REALSTATE')
    }

    const promises = data.map(item => RealStateModel.findOneAndUpdate({
        url: item.url
      }, item, {
        new: true,
        upsert: true
      })
    )

    await Promise.all(promises)

    return {
      _id: 'success'
    }
  }
}

const mutation = {
  createRealState: MutationAdd,
}

module.exports = {
  query,
  mutation
}
