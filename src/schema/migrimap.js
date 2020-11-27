const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} = require('graphql/type');

const { Place } = require('../model/migrimap');


const commonFields = {
  id: {
    type: GraphQLString,
  },
  name: {
    type: GraphQLString,
  },
  description: {
    type: GraphQLString,
  },
  profile: {
    type: GraphQLString
  },
  address: {
    type: GraphQLString
  },
  gmaps: {
    type: GraphQLString
  },
  phone: {
    type: GraphQLString,
  },
  servicesFree: {
    type: GraphQLString
  },
  servicesNonFree: {
    type: GraphQLString
  },
  website: {
    type: GraphQLString
  },
  socialNetwork: {
    type: GraphQLString
  },
  ceo: {
    type: GraphQLString
  },
  owner: {
    type: GraphQLString
  },
  language: {
    type: GraphQLString
  },
  schedule: {
    type: GraphQLString
  },
  capacity: {
    type: GraphQLString
  },
  population: {
    type: GraphQLString
  },
  category: {
    type: GraphQLString
  },
  imageUrl: {
    type: GraphQLString
  },
  imageId: {
    type: GraphQLString
  },
}


const MigriPlaceQueryType = new GraphQLObjectType({
  name: 'MigriPlace',
  fields: () => ({
    _id: {
      type: GraphQLString,
    },
    ...commonFields
  }),
});

const query = {
  migriPlace: {
    type: new GraphQLList(MigriPlaceQueryType),
    args: {
      id: {
        type: GraphQLString,
      },
      first: {
        type: GraphQLInt
      },
    },
    resolve: async (root, {
      id,
      first = 500,
    }) => {
      const query = {}
      if (id) {
        query._id = id
      }

      const items = await Place.find(query).sort({name: 1}).limit(first);

      return items
    }
  }
}

const MutationAdd = {
  type: GraphQLString,
  args: {
    ...commonFields
  },
  resolve: async (root, args) => {
    if (!args) {
      return new Error('ERROR_MIGRIMAP')
    }

    if (args.id) {
      const response = await Place.findOneAndUpdate({
        _id: args.id
      }, args, {
        upsert: true,
        new: true
      })
      return response._id
    }

    const response = await new Place(args).save()
    return response._id
  }
}

const MutationDelete = {
  type: GraphQLString,
  args: {
    id: {
      type: GraphQLString,
    },
  },
  resolve: async (root, args) => {
    if (!args || !args.id) {
      return new Error('ERROR_MIGRIMAP')
    }

    await Place.deleteOne({
      _id: args.id
    })

    return "OK"
  }
}

const mutation = {
  addMigriPlace: MutationAdd,
  deleteMigriPlace: MutationDelete
}

module.exports = {
  query,
  mutation
}
