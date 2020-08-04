const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLInt,
} = require('graphql/type');

const { Politician: PoliticianModel } = require('../model/gobmxn');


const commonFields = {
  name: {
    type: GraphQLString,
  },
  party: {
    type: GraphQLString,
  },
  partyImageURL: {
    type: GraphQLString
  },
  pictureURL: {
    type: GraphQLString
  },
  profileURL: {
    type: GraphQLString
  },
  type: {
    type: GraphQLString,
  },
  state: {
    type: GraphQLString
  },
  circunscripcion: {
    type: GraphQLString
  },
  district: {
    type: GraphQLInt,
  },
  email: {
    type: GraphQLString
  },
  startDate: {
    type: GraphQLString
  },
  status: {
    type: GraphQLBoolean
  },
  role: {
    type: GraphQLString
  }
}


const PoliticianType = new GraphQLObjectType({
  name: 'Politician',
  fields: () => ({
    _id: {
      type: GraphQLString,
    },
    ...commonFields
  }),
});

const query = {
  politician: {
    type: new GraphQLList(PoliticianType),
    args: {
      _id: {
        type: GraphQLString,
      },
      name: {
        type: GraphQLString
      },
      party: {
        type: GraphQLString
      },
      first: {
        type: GraphQLInt
      },
      state: {
        type: GraphQLString
      },
      district: {
        type: GraphQLInt
      }
    },
    resolve: async (root, {
      _id,
      first = 500,
      name,
      party,
      state,
      district
    }) => {
      const query = {}
      if (_id) {
        query._id = _id
      }

      if (name) {
        query['$text'] = {
          $search: name
        }
      }

      if (party) {
        query.party = party
      }

      if (state) {
        query.state = state
      }

      if (district) {
        query.district = district
      }

      const items = await PoliticianModel.find(query).sort({name: 1}).limit(first);

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
    if (!args || !args.profileURL) {
      return new Error('ERROR_POLITICIAN')
    }

    await PoliticianModel.findOneAndUpdate({
      profileURL: args.profileURL
    }, args, {
      upsert: true,
      new: true
    })

    return "OK"
  }
}

const mutation = {
  addPolitician: MutationAdd,
}

module.exports = {
  query,
  mutation
}
