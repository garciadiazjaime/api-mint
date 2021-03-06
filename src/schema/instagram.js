const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
} = require('graphql/type');

const {
  PostModel,
  LocationModel,
  UserModel
} = require('../model/instagramModel');
const {
  getPosts,
  getProfiles
} = require('../util/instagram')
const {
  getType,
  getGpsType,
  getAddressType
} = require('./shared')

function getChildrenType(type) {
  const name = `Children${type}`
  const fields = () => ({
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
  })

  return getType(name, fields)
}

function getMetaType(type) {
  const name = `Meta${type}`
  const fields = () => ({
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
  
  return getType(name, fields)
}

function getCommonLocationFields(type) {
  const defaultFields = { 
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    slug: {
      type: GraphQLString
    },
    gps: {
      type: getGpsType(type)
    },
    address: {
      type: getAddressType(type)
    },
    state: {
      type: GraphQLString
    }
  }

  if (type.includes('Input') && type !== 'LocationPostInput') {
    return defaultFields
  }

  return {
    ...defaultFields,
    _id: {
      type: GraphQLString,
    },
    createdAt: {
      type: GraphQLString
    },
    updatedAt: {
      type: GraphQLString
    },
  }
}

function getLocationType(type) {
  const name = `Location${type}`
  const fields = () => (getCommonLocationFields(name))

  return getType(name, fields)
}

const DistType = new GraphQLObjectType({
  name: 'Dist',
  fields: () => ({
    calculated: {
      type: GraphQLFloat
    }
  })
})

function getPostCommonFields(type) {
  const defaultFields = {
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
      type: GraphQLInt
    },
    children: {
      type: new GraphQLList(getChildrenType(type))
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
    published: {
      type: GraphQLBoolean
    },
    lastCheck: {
      type: GraphQLString
    },
    postUpdate: {
      type: GraphQLString
    },
    hasLocation: {
      type: GraphQLBoolean
    },
    hasPhone: {
      type: GraphQLBoolean
    },
    user: {
      type: getUserType(type)
    },
    location: {
      type: getLocationType(type)
    },
    meta: {
      type: getMetaType(type)
    },
    invalidImage: {
      type: GraphQLBoolean
    }
  }

  if (type.includes('Input')) {
    return defaultFields
  }

  return {
    ...defaultFields,
    _id: {
      type: GraphQLString,
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
  }
}

function getPostType(type) {
  const name = `Post${type}`
  const fields = () => (getPostCommonFields(name))
  
  return getType(name, fields)
}

function getCommonUserFields(type) {
  const defaultFields = { 
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
  }

  if (type.includes('Input')) {
    return defaultFields
  }

  return {
    ...defaultFields,
    _id: {
      type: GraphQLString,
    },
    createdAt: {
      type: GraphQLString
    },
    updatedAt: {
      type: GraphQLString
    },
  }
}

function getUserType(type) {
  const name = `User${type}`
  const fields = () => (getCommonUserFields(name))

  return getType(name, fields)
}

const ProfilePost = new GraphQLObjectType({
  name: 'ProfilePost',
  fields: () => ({
    mediaUrl: {
      type: GraphQLString
    },
    caption: {
      type: GraphQLString
    }
  })
})

const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    username: {
      type: GraphQLString
    },
    title: {
      type: GraphQLString
    },
    mediaUrl: {
      type: GraphQLString
    },
    caption: {
      type: GraphQLString
    },
    phones: {
      type: GraphQLList(GraphQLString)
    },
    keywords: {
      type: GraphQLList(GraphQLString)
    },
    posts: {
      type: GraphQLList(ProfilePost)
    },
    address: {
      type: GraphQLString
    },
    gps: {
      type: GraphQLList(GraphQLFloat)
    },
    dist: {
      type: GraphQLString
    },
    rank: {
      type: GraphQLInt
    }
  })
})

const query = {
  posts: {
    type: new GraphQLList(getPostType('Query')),
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
      liked: {
        type: GraphQLBoolean,
      },
      locationState: {
        type: GraphQLString
      },
      coordinates: {
        type: GraphQLList(GraphQLFloat)
      },
      since: {
        type: GraphQLString
      },
      to: {
        type: GraphQLString
      },
      lastCheck: {
        type: GraphQLString
      },
      postUpdate: {
        type: GraphQLString
      },
      hasLocation: {
        type: GraphQLBoolean
      },
      hasPhone: {
        type: GraphQLBoolean
      },
      userId: {
        type: GraphQLString
      },
      invalidImage: {
        type: GraphQLBoolean
      }
    },
    resolve: (root, {
        _id,
        id,
        first = 50,
        keyword,
        state,
        published,
        liked,
        locationState,
        coordinates,
        since,
        to,
        lastCheck,
        postUpdate,
        hasLocation,
        hasPhone,
        userId,
        invalidImage
      }) =>
      getPosts({
        _id,
        id,
        first,
        keyword,
        state,
        published,
        liked,
        locationState,
        coordinates,
        since,
        to,
        lastCheck,
        postUpdate,
        hasLocation,
        hasPhone,
        userId,
        invalidImage
      }),
  },
  profile: {
    type: new GraphQLList(ProfileType),
    args: {
      first: {
        type: GraphQLInt
      },
      state: {
        type: GraphQLString
      },
      coordinates: {
        type: GraphQLList(GraphQLFloat)
      },
      username: {
        type: GraphQLString
      }
    },
    resolve: (root, {
      first = 50,
      state,
      coordinates,
      username,
    }) => {
      return getProfiles({ first, state, coordinates, username })
    }
  },

  locations: {
    type: new GraphQLList(getLocationType('Query')),
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
    resolve: async (root, {
      _id,
      id,
      slug,
      state,
      first = 1
    }) => {
      const query = {}

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
  },

  users: {
    type: new GraphQLList(getUserType('Query')),
    args: {
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
      }
    },
    resolve: async (root, {
      _id,
      id,
      first = 1
    }) => {
      const query = {}

      if (_id) {
        query._id = _id
      }

      if (id) {
        query.id = id
      }

      const items = await UserModel.find(query).limit(first)

      return items
    }
  }
}

function getMutationAddType(type) {
  return new GraphQLObjectType({
    name: `MutationAdd${type}Type`,
    fields: () => ({
      id: {
        type: GraphQLString
      },
    })
  })
}

function getMutation(type, inputGetter, Model) {
  return {
    type: getMutationAddType(type),
    args: {
      data: {
        type: new GraphQLNonNull(inputGetter)
      }
    },
    resolve: async (root, args) => {
      const { data } = args
      if (!data) {
        return new Error('ERROR_DATA')
      }
  
      const response = await Model.findOneAndUpdate({
        id: data.id
      }, data, {
        upsert: true,
        new: true
      })
  
      return {
        id: response.id
      }
    }
  }
}

const InstagramPostImageMutation = {
  type: GraphQLString,
  args: {
    mediaUrl: {
      type: GraphQLString
    },
  },
  resolve: async (root, args) => {
    if (!args || !args.mediaUrl) {
      return new Error('ERROR_IMAGE_MUTATION')
    }

    const posts = await PostModel.find({
      mediaUrl: args.mediaUrl
    })

    const promises = posts.map(post => {
      post.invalidImage = true
      return post.save()
    })

    await Promise.all(promises)

    return "OK"
  }
}

const UserInputType = new GraphQLInputObjectType({
  name: 'UserInputType',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    username: {
      type: GraphQLString,
    },
    fullName: {
      type: GraphQLString,
    },
    profilePicture: {
      type: GraphQLString,
    },
    followedBy: {
      type: GraphQLInt,
    },
    postsCount: {
      type: GraphQLInt,
    }
  })
})

const AddressInputType = new GraphQLInputObjectType({
  name: 'AddressInputType',
  fields: () => ({
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
  })
})

const GPSInputType = new GraphQLInputObjectType({
  name: 'GPSInputType',
  fields: () => ({
    type: {
      type: GraphQLString
    },
    coordinates: {
      type: GraphQLList(GraphQLFloat)
    },
  })
})

const LocationInputType = new GraphQLInputObjectType({
  name: 'LocationInputType',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    slug: {
      type: GraphQLString,
    },
    address: {
      type: AddressInputType,
    },
    gps: {
      type: GPSInputType,
    }
  })
})

const MetaInputType = new GraphQLInputObjectType({
  name: 'MetaInputType',
  fields: () => ({
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

const MutationInstagramPost = {
  type: GraphQLString,
  args: {
    id: {
      type: GraphQLString,
    },

    permalink: {
      type: GraphQLString,
    },
    mediaUrl: {
      type: GraphQLString,
    },
    mediaType: {
      type: GraphQLString,
    },
    caption: {
      type: GraphQLString,
    },
    commentsCount: {
      type: GraphQLInt,
    },
    likeCount: {
      type: GraphQLInt,
    },
    city: {
      type: GraphQLString,
    },
    source: {
      type: GraphQLString,
    },

    state: {
      type: GraphQLString,
    },
    user: {
      type: UserInputType,
    },
    location: {
      type: LocationInputType,
    },
    meta: {
      type: MetaInputType,
    },
    invalidImage: {
      type: GraphQLBoolean,
    },

    liked: {
      type: GraphQLBoolean,
    },
  },
  resolve: async (root, args) => {
    if (!args || !args.id) {
      return 'ERROR_INSTAGRAM_POST'
    }

    await PostModel.findOneAndUpdate({
      id: args.id
    }, args, {
      upsert: true,
      new: true
    })

    return "OK"
  }
}

const MutationInstagramUser = {
  type: GraphQLString,
  args: {
    id: {
      type: GraphQLString,
    },
    username: {
      type: GraphQLString,
    },
    fullName: {
      type: GraphQLString,
    },
    profilePicture: {
      type: GraphQLString,
    },
    followedBy: {
      type: GraphQLInt,
    },
    postsCount: {
      type: GraphQLInt,
    }
  },
  resolve: async (root, args) => {
    if (!args || !args.id) {
      return 'ERROR_INSTAGRAM_USER'
    }

    await UserModel.findOneAndUpdate({
      id: args.id
    }, args, {
      upsert: true,
      new: true
    })

    return "OK"
  }
}

const MutationInstagramLocation = {
  type: GraphQLString,
  args: {
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    slug: {
      type: GraphQLString,
    },
    address: {
      type: AddressInputType,
    },
    gps: {
      type: GPSInputType,
    }
  },
  resolve: async (root, args) => {
    if (!args || !args.id) {
      return 'ERROR_INSTAGRAM_POST'
    }

    await LocationModel.findOneAndUpdate({
      id: args.id
    }, args, {
      upsert: true,
      new: true
    })

    return "OK"
  }
}

const mutation = {
  updateInstagramPost: MutationInstagramPost,
  updateInstagramUser: MutationInstagramUser,
  updateInstagramLocation: MutationInstagramLocation,
  createInstagramPost: getMutation('InstagramPost', getPostType('Input'), PostModel),
  createInstagramLocation: getMutation('InstagramLocation', getLocationType('Input'), LocationModel),
  createInstagramUser: getMutation('InstragramUser', getUserType('Input'), UserModel),
  updateInstagramPostImage: InstagramPostImageMutation
}

module.exports = {
  query,
  mutation
}
