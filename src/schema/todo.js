const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql/type');

const TodoModel = require('../model/todo');

const TodoType = new GraphQLObjectType({
  name: 'Todo',
  fields: () => ({
    _id: {
      type: GraphQLString,
    },
    todo: {
      type: GraphQLString,
    },
    state: {
      type: GraphQLBoolean,
    },
    createdAt: {
      type: GraphQLString
    },
    updatedAt: {
      type: GraphQLString
    }
  }),
});

const query = {
  todo: {
    type: new GraphQLList(TodoType),
    args: {
      _id: {
        type: GraphQLString,
      },
      first: {
        type: GraphQLInt
      },
      state: {
        type: GraphQLBoolean
      },
      todo: {
        type: GraphQLString
      }
    },
    resolve: async (root, {
      _id,
      first = 50,
      state,
      todo
    }) => {
      const query = {}
      if (_id) {
        query._id = _id
      }

      if (todo) {
        query['$text'] = {
          $search: todo
        }
      }

      if (state) {
        query.state = state
      }

      const items = await TodoModel.find(query).limit(first);

      return items
    }
  }
}

const MutationAdd = {
  type: TodoType,
  args: {
    todo: {
      type: new GraphQLNonNull(GraphQLString)
    },
  },
  resolve: (root, args) => {
    return new TodoModel(args).save()
  }
}

const MutationDelete = {
  type: TodoType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root, args) => {
    return TodoModel.findById(args.id).remove()
  }
}

const MutationUpdate = {
  type: TodoType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    state: {
      type: GraphQLBoolean,
    },
    todo: {
      type: GraphQLString,
    },
  },
  resolve: (root, args) => {
    return TodoModel.update({
      _id: args.id
    }, args)
  }
}

const mutation = {
  addTodo: MutationAdd,
  deleteTodo: MutationDelete,
  updateTodo: MutationUpdate,
}

module.exports = {
  query,
  mutation
}
