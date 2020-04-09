const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} = require('graphql/type');

const {PostModel, UserModel} = require('../model/instagramModel');

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
    location: {
      type: locationType
    },
    post: {
      type: PostType
    },
    options: {
      type: new GraphQLList(GraphQLString)
    }
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
    userId: {
      type: GraphQLString
    },
    createdAt: {
      type: GraphQLString
    },
    updatedAt: {
      type: GraphQLString
    },
    options: {
      type: new GraphQLList(GraphQLString)
    }
  }),
});

function getQuery(city, keyword, state = 'CREATED') {
  const query = {}

  if (city) {
    query.city = city
  }

  if (keyword) {
    query['$text'] = {$search: keyword}
  }

  if (state) {
    query.state = state
  }

  return query
}

const Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Instagram',
    fields: {
      posts: {
        type: new GraphQLList(PostType),
        args: {
          _id: {
            name: '_id',
            type: GraphQLString,
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
        resolve: async (root, {first = 50, city, keyword, state}) => {
          const query = getQuery(city, keyword, state)
          const items = await PostModel.find(query).sort('-likeCount').limit(first);

          return items
        },
      },

      users: {
        type: new GraphQLList(userType),
        args: {
          _id: {
            name: '_id',
            type: GraphQLString
          }
        },
        resolve: async (root, {first = 50}) => {
          const query  = {}
          const items = await UserModel.find(query).sort('username').limit(first)

          return items
        }
      }
    },
  }),
});

module.exports = Schema;
