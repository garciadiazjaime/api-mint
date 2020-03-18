const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} = require('graphql/type');

const Model = require('../model/instagramModel');

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

const CustomType = new GraphQLObjectType({
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
    createdAt: {
      type: GraphQLString
    },
    updatedAt: {
      type: GraphQLString
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
    name: 'Query',
    fields: {
      posts: {
        type: new GraphQLList(CustomType),
        args: {
          _id: {
            name: '_id',
            type: GraphQLString,
          },
          keyword: {
            type: GraphQLString
          },
          state: {
            type: GraphQLString
          }
        },
        resolve: async (root, {first = 50, city, keyword, state}) => {
          const query = getQuery(city, keyword, state)
          const items = await Model.find(query).sort('-updatedAt').limit(first);

          return items
        },
      },
    },
  }),
});

module.exports = Schema;
