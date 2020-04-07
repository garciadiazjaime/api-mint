const {PostModel, UserModel} = require('../model/instagramModel')

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

function getPost(postId) {
  return PostModel.findById(postId)
}

function addUserToPost(post, user) {
  post.state= 'MAPPED'

  if (user && user._id) {
    post.userId = user._id
  }

  return post.save()
}

function saveUser(user, location, post) {
  if (!user) {
    return
  }

  user.post = post
  user.location = location

  return UserModel.findOneAndUpdate({
    id: user.id
  }, user, {
    new: true,
    upsert: true
  })
}

module.exports = {
  save,
  schedule,
  remove,
  getPost,
  addUserToPost,
  saveUser,
}
