const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql/type');

const TodoModel = require('../model/todo');

const TodoInput = new GraphQLInputObjectType({
  name: 'TodoInput',
  fields: () => ({
    todo: {
      type: GraphQLString,
    },
    position: {
      type: GraphQLInt,
    }
  })
})


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
    position: {
      type: GraphQLInt
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
      first = 500,
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

      const items = await TodoModel.find(query).sort({position: 1}).limit(first);

      return items
    }
  }
}

const MutationAdd = {
  type: TodoType,
  args: {
    todos: {
      type: new GraphQLNonNull(GraphQLList(TodoInput))
    },
  },
  resolve: async (root, args) => {
    const { todos } = args
    if (!Array.isArray(todos) || !todos.length) {
      return new Error('ERROR_TODOS')
    }

    const maxPosition = await TodoModel.findOne().sort({position: -1})

    const promises = todos.map(item => new TodoModel({
      todo: item.todo,
      position: item.position + (maxPosition && maxPosition.position || 0)
    }).save())

    await Promise.all(promises)

    return {
      state: true
    }
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
    _id: {
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
      _id: args._id
    }, args)
  }
}

const mutation = {
  addTodos: MutationAdd,
  deleteTodo: MutationDelete,
  updateTodo: MutationUpdate,
}

module.exports = {
  query,
  mutation
}
