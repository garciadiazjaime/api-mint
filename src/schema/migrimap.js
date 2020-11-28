const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLInputObjectType
} = require('graphql/type');

const { Place } = require('../model/migrimap');

const GPSInputType = new GraphQLInputObjectType({
  name: 'GPSInputTypeMigrimap',
  fields: () => ({
    type: {
      type: GraphQLString
    },
    coordinates: {
      type: GraphQLList(GraphQLFloat)
    },
  })
})

const GPSType = new GraphQLObjectType({
  name: 'GPSTypeMigrimap',
  fields: () => ({
    type: {
      type: GraphQLString
    },
    coordinates: {
      type: GraphQLList(GraphQLFloat)
    },
  })
})


const MigriPlaceQueryType = new GraphQLObjectType({
  name: 'MigriPlace',
  fields: () => ({
    _id: {
      type: GraphQLString,
    },
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
    gps: {
      type: GPSType,
    },
    dist: {
      type: GraphQLString
    }
  }),
});

const query = {
  migriPlace: {
    type: new GraphQLList(MigriPlaceQueryType),
    args: {
      id: {
        type: GraphQLString,
      },
      lngLat: {
        type: GraphQLList(GraphQLFloat)
      },
      first: {
        type: GraphQLInt
      },
    },
    resolve: (root, {
      id,
      lngLat,
      first = 50,
    }) => {
      const query = {}

      if (lngLat) {
        return Place.aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: lngLat
              },
              distanceField: "dist",
              maxDistance: 7000,
              spherical: true
            }
          }
       ])
      }

      if (id) {
        query._id = id
      }

      return Place.find(query).sort({name: 1}).limit(first);
    }
  }
}

const MutationAdd = {
  type: GraphQLString,
  args: {
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
    gps: {
      type: GPSInputType,
    }
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
