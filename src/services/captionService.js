const CaptionModel = require('../model/captionModel')

module.exports.saveCaption = async function(data) {
  const caption = new CaptionModel(data)
  return caption.save()
}
