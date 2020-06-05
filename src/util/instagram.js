const { PostModel } = require('../model/instagramModel');

const fieldsByDefault = {
  _id: "$user.id",
  id: {
    $first: "$id"
  },
  permalink: {
    $first: "$permalink"
  },
  mediaType: {
    $first: "$mediaType"
  },
  mediaUrl: {
    $first: "$mediaUrl"
  },
  caption: {
    $first: "$caption"
  },
  children: {
    $first: "$children"
  },
  user: {
    $first: "$user"
  },
  location: {
    $first: "$location"
  },
  dist: {
    $first: "$dist"
  },
  meta: {
    $first: "$meta"
  },
  createdAt: {
    $first: "$createdAt"
  },
  updatedAt: {
    $first: "$updatedAt"
  },
}

function getPostsByLocationAndUser({ coordinates, state, first }) {
  const radiusInMTS = 1000 * 5;

  const filters = [
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates
        },
        distanceField: "dist.calculated",
        maxDistance: radiusInMTS,
        spherical: true
      }
    },
    {
      $group: {
        ...fieldsByDefault
      }
    },
    {
      $limit: first
    },
    {
      $sort : { 'meta.rank': -1, 'createdAt': -1 }
    }
  ]

  if (state) {
    filters.push({
      $match: {
        state
      }
    })
  }

  return PostModel.aggregate(filters)
}

function getQueryForPosts({ _id, id, keyword, state, published, locationState }) {
  const query = {}

  if (keyword) {
    query['$text'] = { $search: keyword }
  }

  if (state) {
    query.state = state
  }

  if (_id) {
    query._id = _id
  }

  if (id) {
    query.id = id
  }

  if (published === true || published === false) {
    query.published = published
  }

  if (locationState) {
    query['location.state'] = locationState
  }

  return query
}

function getPostByScoreAndUser({ _id, id, first, keyword, state, published, locationState}) {
  const query = getQueryForPosts({ _id, id, keyword, state, published, locationState })

  const filters = [
    {
      $group: {
        ...fieldsByDefault
      }
    },
    {
      $match: query
    },
    {
      $limit: first
    },
    {
      $sort : { 'meta.rank': -1, 'createdAt': -1 }
    }
  ]

  return PostModel.aggregate(filters)
}

function mergePostsByLocationAndScore(postsByLocation, postsByScore, first) {
  const items = [...postsByLocation]
  const postsByLocationIds = {}

  postsByLocation.forEach(item => {
    postsByLocationIds[item._id] = true
  })

  return postsByScore.reduce((accu, item) => {
    if (accu.length < first && !postsByLocationIds[items._id]) {
      accu.push(item)
    }

    return accu
  }, items)
}

function getPostByScore({ _id, id, first, keyword, state, published, locationState }) {
  const query = getQueryForPosts({ _id, id, keyword, state, published, locationState })

  return PostModel.find(query).sort([
    ['meta.rank', -1],
    ['createdAt', -1],
  ]).limit(first)
}


async function getPosts({_id, id, first, keyword, state, published, locationState, coordinates}) {
  if (Array.isArray(coordinates) && coordinates.length) {
    const postsByLocation = await getPostsByLocationAndUser({ coordinates, state, first })

    const postsByScore = await getPostByScoreAndUser({ _id, id, first, keyword, state, published, locationState})

    const items = await mergePostsByLocationAndScore(postsByLocation, postsByScore, first)

    return items
  }


  return getPostByScore({ _id, id, first, keyword, state, published, locationState })
}

module.exports = {
  getPosts
}
