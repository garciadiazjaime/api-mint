const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} = require('graphql/type');

const { PostModel, BrandModel } = require('../model/instagramModel');

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

const brandType = new GraphQLObjectType({
  name: 'Brand',
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
    location: {
      type: locationType
    },
    post: {
      type: PostType
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
    state: {
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
    latitude: {
      type: GraphQLString
    },
    longitude: {
      type: GraphQLString
    },
    address: {
      type: addressType
    }
  }),
});

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
    brandId: {
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

const Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Instagram',
    fields: {
      posts: {
        type: new GraphQLList(PostType),
        args: {
          first: {
            type: GraphQLInt
          },
          keyword: {
            type: GraphQLString
          },
          state: {
            type: GraphQLString
          },
        },
        resolve: async (root, {first = 50, keyword, state }) => {
          const query = {}

          if (keyword) {
            query['$text'] = { $search: keyword }
          }

          if (state) {
            query.state = state
          }

          const items = await PostModel.find(query).sort('-likeCount').limit(first);

          return items
        },
      },

      brands: {
        type: new GraphQLList(brandType),
        args: {
          _id: {
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
        },
        resolve: async (root, {_id, first = 50, keyword, state }) => {
          const query  = {}

          if (keyword) {
            query['$text'] = { $search: keyword }
          }

          if (state) {
            query.state = state
          }

          if (_id) {
            query._id = _id
          }

          const items = await BrandModel.find(query).sort([['post.createdAt', -1], ['rank', -1]]).limit(first)

          return items
        }
      }
    },
  }),
});

module.exports = Schema;
