const {PostModel, UserModel} = require('../model/instagramModel')

function savePost (data) {
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

function addUserToPost(post, user, state) {
  post.state= state || 'MAPPED'

  if (user && user._id) {
    post.userId = user._id
  }

  return post.save()
}

async function saveUser(user, location, post) {
  if (!user) {
    return
  }

  const userRecord = await UserModel.findOne({
    id: user.id
  })

  if (!userRecord) {
    user.post = post
    user.location = location
    user.options = user.options

    return new UserModel(user).save()
  }

  userRecord.post = post
  userRecord.location = location

  if (Array.isArray(userRecord.options) && Array.isArray(user.options)) {
    user.options.forEach(option => {
      if (!userRecord.options.includes(option)) {
        userRecord.options.push(option)
      }
    })
  } else {
    userRecord.options = user.options
  }

  if (Array.isArray(userRecord.phones) && Array.isArray(user.phones)) {
    user.phones.forEach(phone => {
      if (!userRecord.phones.includes(phone)) {
        userRecord.phones.push(phone)
      }
    })
  } else if (Array.isArray(user.phones)) {
    userRecord.phones = user.phones
  }

  return userRecord.save()
}

module.exports = {
  savePost,
  schedule,
  remove,
  getPost,
  addUserToPost,
  saveUser,
}
