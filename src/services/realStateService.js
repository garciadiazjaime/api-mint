const RealStateModel = require('../model/realStateModel')

module.exports.save = function(data) {
  return RealStateModel.findOneAndUpdate({
    url: data.url
  }, data, {
    new: true,
    upsert: true
  })
}
