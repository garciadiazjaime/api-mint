const {PostModel, UserModel, LocationModel} = require('../model/instagramModel')

function save (data) {
  return PostModel.findOneAndUpdate({
    id: data.id
  }, {
    ...data,
    state: 'CREATED'
   }, {
    new: true,
    upsert: true
  })
}


function schedule(postId) {
  return PostModel.findOneAndUpdate({
    _id: postId
  }, {
    state: 'SCHEDULED'
  })
}

function remove(postId) {
  return PostModel.findOneAndUpdate({
    _id: postId
  }, {
    state: 'REMOVED'
  })
}

function addUserLocationToPost(postId, user, location) {
  const data = {
    state: 'MAPPED'
  }

  if (user) {
    data.user = user
  }

  if(location) {
    data.location = location
  }

  return PostModel.findOneAndUpdate({
    _id: postId
  }, data)
}

function saveUser(user) {
  if (!user) {
    return
  }

  return UserModel.findOneAndUpdate({
    id: user.id
  }, user, {
    new: true,
    upsert: true
  })
}

function saveLocation(location) {
  if (!location) {
    return 
  }

  return LocationModel.findOneAndUpdate({
    id: location.id
  }, location, {
    new: true,
    upsert: true
  })
}

module.exports = {
  save,
  schedule,
  remove,
  addUserLocationToPost,
  saveUser,
  saveLocation,
}
