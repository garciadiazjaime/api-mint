const Model = require('../model/instagramModel')

function save (data) {
  return Model.findOneAndUpdate({
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
  return Model.findOneAndUpdate({
    _id: postId
  }, {
    state: 'SCHEDULED'
  })
}

function remove(postId) {
  return Model.findOneAndUpdate({
    _id: postId
  }, {
    state: 'REMOVED'
  })
}

module.exports = {
  save,
  schedule,
  remove
}
