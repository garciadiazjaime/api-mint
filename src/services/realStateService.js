const RealStateModel = require('../model/realStateModel')

module.exports.savePlace = function(data) {
  return RealStateModel.findOneAndUpdate({
    url: data.url
  }, data, {
    new: true,
    upsert: true
  })
}
