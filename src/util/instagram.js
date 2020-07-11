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

function getQueryForPosts({ _id, id, keyword, state, published, locationState, since, to, lastCheck }) {
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

  if (since && to) {
    query.createdAt = {
      $gte: new Date(since),
      $lte: new Date(to)
    }
  } else if (since) {
    query.createdAt = {
      $gte: new Date(since)
    }
  } else if (to) {
    query.createdAt = {
      $lte: new Date(to)
    }
  }

  if (lastCheck) {
    query.$or = [{lastCheck: {$exists: 0}}, {lastCheck: {$lte: new Date(lastCheck)}}]
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

function getPostByScore({ _id, id, first, keyword, state, published, locationState, since, to, lastCheck }) {
  const query = getQueryForPosts({ _id, id, keyword, state, published, locationState, since, to, lastCheck })

  return PostModel.find(query).sort([
    ['meta.rank', -1],
    ['createdAt', -1],
  ]).limit(first)
}


async function getPosts({ _id, id, first, keyword, state, published, locationState, coordinates, since, to, lastCheck }) {
  if (Array.isArray(coordinates) && coordinates.length) {
    const postsByLocation = await getPostsByLocationAndUser({ coordinates, state, first })

    return postsByLocation
  }


  return getPostByScore({ _id, id, first, keyword, state, published, locationState, since, to, lastCheck })
}

module.exports = {
  getPosts
}
