const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
} = require('graphql/type');

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

module.exports = {
  gpsType
}
