const Model = require('../model/instagramModel')

function save (data) {
  return Model.findOneAndUpdate({
    id: data.id
  }, data, {
    new: true,
    upsert: true
  })
}

module.exports = {
  save
}
