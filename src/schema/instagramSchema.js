const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
} = require('graphql/type');

const { PostModel, LocationModel } = require('../model/instagramModel');

const CustomChildrenType = new GraphQLObjectType({
  name: 'Children',
  fields: () => ({
    media_type: {
      type: GraphQLString
    },
    media_url: {
      type: GraphQLString
    },
    caption: {
      type: GraphQLString
    },
    id: {
      type: GraphQLString
    }
  }),
});

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: {
      type: GraphQLString
    },
    id: {
      type: GraphQLString
    },
    username: {
      type: GraphQLString
    },
    fullName: {
      type: GraphQLString
    },
    profilePicture: {
      type: GraphQLString
    },
  }),
});

const addressType = new GraphQLObjectType({
  name: 'Address',
  fields: () => ({
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
  }),
});

const gpsType = new GraphQLObjectType({
  name: 'GPS',
  fields: () => ({
    type: {
      type: GraphQLString
    },
    coordinates: {
      type: GraphQLList(GraphQLFloat)
    },
  }),
});

const locationType = new GraphQLObjectType({
  name: 'Location',
  fields: () => ({
    _id: {
      type: GraphQLString
    },
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    slug: {
      type: GraphQLString
    },
    location: {
      type: gpsType
    },
    address: {
      type: addressType
    },
    state: {
      type: GraphQLString
    },
  }),
});

const metaType = new GraphQLObjectType({
  name: 'Meta',
  fields: () => ({
    _id: {
      type: GraphQLString
    },
    options: {
      type: new GraphQLList(GraphQLString)
    },
    phones: {
      type: new GraphQLList(GraphQLString)
    },
    rank: {
      type: GraphQLInt
    },
  })
})

const DistType = new GraphQLObjectType({
  name: 'Dist',
  fields: () => ({
    calculated: {
      type: GraphQLFloat
    }
  })
})

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    _id: {
      type: GraphQLString,
    },
    commentsCount: {
      type: GraphQLInt,
    },
    permalink: {
      type: GraphQLString,
    },
    mediaType: {
      type: GraphQLString
    },
    mediaUrl: {
      type: GraphQLString
    },
    caption: {
      type: GraphQLString
    },
    id: {
      type: GraphQLString
    },
    likeCount: {
      type: GraphQLString
    },
    children: {
      type: new GraphQLList(CustomChildrenType)
    },
    city: {
      type: GraphQLString
    },
    source: {
      type: GraphQLString
    },
    state: {
      type: GraphQLString
    },
    user: {
      type: userType
    },
    location: {
      type: locationType
    },
    meta: {
      type: metaType
    },
    createdAt: {
      type: GraphQLString
    },
    updatedAt: {
      type: GraphQLString
    },
    dist: {
      type: DistType
    }
  }),
});

const Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Instagram',
    fields: {
      posts: {
        type: new GraphQLList(PostType),
        args: {
          _id: {
            type: GraphQLString
          },
          id: {
            type: GraphQLString
          },
          first: {
            type: GraphQLInt
          },
          keyword: {
            type: GraphQLString
          },
          state: {
            type: GraphQLString
          },
          published: {
            type: GraphQLBoolean
          },
          locationState: {
            type: GraphQLString
          },
          coordinates: {
            type: GraphQLList(GraphQLFloat)
          }
        },
        resolve: async (root, {_id, id, first = 50, keyword, state, published, locationState, coordinates }) => {
          const query = {}

          if (Array.isArray(coordinates) && coordinates.length) {
            const filters = [
              {
                $geoNear: {
                  near: {
                    type: "Point",
                    coordinates
                  },
                  distanceField: "dist.calculated",
                  maxDistance: 1000 * 100,
                  spherical: true
                }
              },
              {
                $limit: first
              }
            ]

            if (state) {
              filters.push({
                $match: {
                  state
                }
              })
            }

            const items = await PostModel.aggregate(filters)

            return items
          }

          if (keyword) {
            query['$text'] = { $search: keyword }
          }

          if (state) {
            query.state = state
          }

          if (_id) {
            query._id = _id
          }

          if (id) {
            query.id = id
          }

          if (published === true || published === false) {
            query.published = published
          }

          if (locationState) {
            query['location.state'] = locationState
          }

          const items = await PostModel.find(query).sort([
            ['meta.rank', -1],
            ['createdAt', -1],
          ]).limit(first)

          return items
        },
      },

      location: {
        type: new GraphQLList(locationType),
        args: {
          _id: {
            type: GraphQLString
          },
          id: {
            type: GraphQLString
          },
          slug: {
            type: GraphQLString
          },
          state: {
            type: GraphQLString
          },
          first: {
            type: GraphQLInt
          }
        },
        resolve: async (root, { _id, id, slug, state, first = 1 }) => {
          const query  = {}

          if (_id) {
            query._id = _id
          }

          if (id) {
            query.id = id
          }

          if (slug) {
            query.slug = slug
          }

          if (state) {
            query.state = state
          }

          const items = await LocationModel.find(query).limit(first)

          return items
        }
      }
    },
  }),
});

module.exports = Schema;
