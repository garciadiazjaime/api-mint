const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLInputObjectType
} = require('graphql/type');

const PortModel = require('../model/port');

const commonFields = {
  portId: {
    type: GraphQLInt,
  },
  city: {
    type: GraphQLString,
  },
  name: {
    type: GraphQLString,
  },
  portStatus: {
    type: GraphQLString,
  },
  type: {
    type: GraphQLInt,
  },
  entry: {
    type: GraphQLInt,
  },
  updateTime: {
    type: GraphQLString,
  },
  status: {
    type: GraphQLString,
  },
  delay: {
    type: GraphQLInt,
  },
  lanes: {
    type: GraphQLInt,
  },
  uuid: {
    type: GraphQLString
  },
}

const PortType = new GraphQLObjectType({
  name: 'Port',
  fields: () => ({
    _id: {
      type: GraphQLString,
    },
    ...commonFields,
    createdAt: {
      type: GraphQLString
    },
    updatedAt: {
      type: GraphQLString
    }
  }),
});

const query = {
  port: {
    type: new GraphQLList(PortType),
    args: {
      _id: {
        type: GraphQLString,
      },
      first: {
        type: GraphQLInt
      },
      city: {
        type: GraphQLString
      },
      uuid: {
        type: GraphQLString
      }
    },
    resolve: async (root, {
      _id,
      first = 1,
      city,
    }) => {
      const query = {}
      if (_id) {
        query._id = _id
      }

      if (city) {
        query.city = city
      }

      if (uuid) {
        query.uuid = uuid
      }

      const items = await PortModel.find(query).limit(first);

      return items
    }
  }
}

const PortInput = new GraphQLInputObjectType({
  name: 'PortInput',
  fields: () => ({
    ...commonFields
  }),
})

const MutationAdd = {
  type: PortType,
  args: {
    report: {
      type: new GraphQLNonNull(GraphQLList(PortInput))
    },
  },
  resolve: async (root, args) => {
    const { report } = args

    if (!Array.isArray(report) || !report.length) {
      return new Error('ERROR_REPORT')
    }

    const promises = report.map(port => new PortModel(port).save())

    await Promise.all(promises)

    return {
      _id: 'success'
    }
  }
}

const mutation = {
  addReport: MutationAdd,
}

module.exports = {
  query,
  mutation
}
