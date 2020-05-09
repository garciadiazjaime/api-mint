const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql/type');

const WordModel = require('../model/word');

const DefinitionType = new GraphQLObjectType({
  name: 'DefintionType',
  fields: () => ({
    definition: {
      type: GraphQLString,
    },
    example: {
      type: GraphQLString,
    }
  })
})

const DefinitionInput = new GraphQLInputObjectType({
  name: 'DefintionInput',
  fields: () => ({
    definition: {
      type: GraphQLString,
    },
    example: {
      type: GraphQLString,
    }
  })
})

const TermType = new GraphQLObjectType({
  name: 'Term',
  fields: () => ({
    _id: {
      type: GraphQLString,
    },
    term: {
      type: GraphQLString,
    },
    definitions: {
      type: new GraphQLList(DefinitionType),
    },
    createdAt: {
      type: GraphQLString
    },
    updatedAt: {
      type: GraphQLString
    }
  }),
});

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    Words: {
      type: new GraphQLList(TermType),
      args: {
        _id: {
          type: GraphQLString,
        },
        first: {
          type: GraphQLInt
        },
        term: {
          type: GraphQLString
        }
      },
      resolve: async (root, {
        _id,
        first = 50,
        term
      }) => {
        const query = {}
        if (_id) {
          query._id = _id
        }

        if (term) {
          query['$text'] = {
            $search: term
          }
        }

        const items = await WordModel.find(query).limit(first);

        return items
      },
    },
  },
})

const MutationAdd = {
  type: TermType,
  args: {
    term: {
      type: new GraphQLNonNull(GraphQLString)
    },
    definitions: {
      type: new GraphQLNonNull(GraphQLList(DefinitionInput))
    }
  },
  resolve: (root, args) => {
    return WordModel.findOneAndUpdate({
      term: args.term
    }, args, {
      upsert: true,
      new: true
    })
  }
}

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    add: MutationAdd
  }
})

const schema = new GraphQLSchema({
  query,
  mutation
});

module.exports = schema;
