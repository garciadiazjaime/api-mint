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

function getQueryForPosts({ _id, id, keyword, state, published, locationState, since, to, lastCheck, postUpdate, hasLocation, hasPhone, userId, invalidImage }) {
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

  if (hasLocation === false) {
    query.$and = [ {hasLocation: {$exists: 0}}, {'location.location.coordinates': { $exists: 0}} ]
  }

  if (!hasPhone === false) {
    query.$and = [ { hasPhone: {$exists: 0} }, {'meta.phones': []} ]
  }

  if (userId) {
    query.$and = [ {'user.id': userId}, {'location.location.coordinates': { $exists: 1}} ]
  }

  if (invalidImage) {
    query.invalidImage = invalidImage
  }

  return query
}

function getPostByScore({ _id, id, first, keyword, state, published, locationState, since, to, lastCheck, postUpdate, hasLocation, hasPhone, userId, invalidImage }) {
  const query = getQueryForPosts({ _id, id, keyword, state, published, locationState, since, to, lastCheck, postUpdate, hasLocation, hasPhone, userId, invalidImage })

  return PostModel.find(query).sort([
    ['meta.rank', -1],
    ['createdAt', -1],
  ]).limit(first)
}


async function getPosts({ _id, id, first, keyword, state, published, locationState, coordinates, since, to, lastCheck, postUpdate, hasLocation, hasPhone, userId, invalidImage }) {
  if (Array.isArray(coordinates) && coordinates.length) {
    const postsByLocation = await getPostsByLocationAndUser({ coordinates, state, first })

    return postsByLocation
  }


  return getPostByScore({ _id, id, first, keyword, state, published, locationState, since, to, lastCheck, postUpdate, hasLocation, hasPhone, userId, invalidImage })
}

function getUsernameCoordinates({ username, first, state }) {
  const filters = [
    {
      $match: {
        state,
        'user.username': username,
        'location.location.coordinates': {
          $exists: 1
        }
      }
    },
    {
      $limit: first
    },
    {
      $group: {
        _id: "$location.location.coordinates",
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort : { 'count': -1 }
    },
    {
      $limit: 1
    },
  ]

  return PostModel.aggregate(filters)
}

async function getProfiles({ first, state, coordinates, username }) {
  const radiusInMTS = 1000 * 5;
  let coordinatesSelected = coordinates

  if (username) {
    const response = await getUsernameCoordinates({ first, state, username })

    if (Array.isArray(response) && response.length) {
      coordinatesSelected = response[0]._id
    }
  }

  const filters = [
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: coordinatesSelected
        },
        distanceField: "dist",
        maxDistance: radiusInMTS,
        spherical: true
      }
    },
    {
      $match: {
        state
      }
    },
    {
      $group: {
        _id: "$user.id",
        id: {
          $first: "$id"
        },
        username: {
          $first: "$user.username"
        },
        title: {
          $first: {
            $ifNull: ["$location.name", {
              $ifNull: ["$user.fullName", "$user.username"]
            }]
          }
        },
        mediaUrl: {
          $first: {
            $ifNull: ["$mediaUrl", {
              $arrayElemAt: ["$children.media_url", 0]
            }]
          }
        },
        caption: {
          $first: "$caption"
        },
        phones: {
          $first: "$meta.phones"
        },
        keywords: {
          $first: "$meta.options"
        },
        posts: {
          $push: {
            mediaUrl: "$mediaUrl",
            caption: "$caption"
          }
        },
        address: {
          $first: "$location.address.street"
        },
        dist: {
          $first: "$dist"
        },
        rank: {
          $first: "$meta.rank"
        },
        createdAt: {
          $first: "$createdAt"
        },
      }
    },
    {
      $sort : { 'rank': -1, 'createdAt': -1 }
    },
    {
      $limit: first
    },
  ]

  return PostModel.aggregate(filters)
}

module.exports = {
  getPosts,
  getProfiles
}
