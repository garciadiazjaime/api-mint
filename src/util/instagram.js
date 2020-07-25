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
    state ? {
      $match: {
        state
      }
    } : {},
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

  return PostModel.aggregate(filters)
}

function getQueryForPosts({ _id, id, keyword, state, published, locationState, since, to, lastCheck, postUpdate }) {
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

  if (postUpdate) {
    query.$or = [{postUpdate: {$exists: 0}}, {postUpdate: {$lte: new Date(postUpdate)}}, {mediaUrl: null}]
  }

  return query
}

function getPostByScore({ _id, id, first, keyword, state, published, locationState, since, to, lastCheck, postUpdate }) {
  const query = getQueryForPosts({ _id, id, keyword, state, published, locationState, since, to, lastCheck, postUpdate })

  return PostModel.find(query).sort([
    ['meta.rank', -1],
    ['createdAt', -1],
  ]).limit(first)
}


async function getPosts({ _id, id, first, keyword, state, published, locationState, coordinates, since, to, lastCheck, postUpdate }) {
  if (Array.isArray(coordinates) && coordinates.length) {
    const postsByLocation = await getPostsByLocationAndUser({ coordinates, state, first })

    return postsByLocation
  }


  return getPostByScore({ _id, id, first, keyword, state, published, locationState, since, to, lastCheck, postUpdate })
}

module.exports = {
  getPosts
}
