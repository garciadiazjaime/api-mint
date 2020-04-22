const { PostModel, BrandModel } = require('../model/instagramModel')

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

function updatePostState(post, brand, state) {
  if (brand && brand._id) {
    post.state = 'MAPPED'
  } else {
    post.state = 'ERROR_NOID'
  }

  if (state) {
    post.state = state
  }

  return post.save()
}

async function saveBrand(brand) {
  if (!brand || brand.id) {
    return
  }

  return BrandModel.findOneAndUpdate({
    id: brand.id
  }, {
    ...brand,
    state: 'CREATED'
   }, {
    new: true,
    upsert: true
  })
}

async function updateBrand(brand) {
  if (!brand) {
    return
  }

  return BrandModel.findOneAndUpdate({
    _id: brand._id
  }, brand)
}

module.exports = {
  savePost,
  schedule,
  remove,
  getPost,
  updatePostState,
  saveBrand,
  updateBrand
}
