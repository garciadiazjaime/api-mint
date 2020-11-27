const { promisify } = require('util')
const cloudinary = require('cloudinary').v2;

const config = require('../config')

cloudinary.config({
  cloud_name: config.get('cloudinary.user'),
  api_key: config.get('cloudinary.key'),
  api_secret: config.get('cloudinary.secret')
});

const {
  Place: MigrimapModel
} = require('../model/migrimap')

const deleteImage = promisify(cloudinary.uploader.destroy)
const uploadImage = promisify(cloudinary.uploader.upload)

async function upload(file, entity, oldImageId) {
  if (oldImageId) {
    await deleteImage(oldImageId)
  }

  const response = await uploadImage(file.path, {
    folder: entity
  })

  return {
    imageUrl: response.url,
    imageId: response.public_id
  }
}

async function save(image, params) {
  const {
    entity,
    id,
    imageId: oldImageId
  } = params

  const { imageUrl, imageId } = await upload(image, entity, oldImageId)

  if (entity === 'migrimap') {
    return MigrimapModel.findOneAndUpdate({
      _id: id
    }, {
      imageUrl,
      imageId
    }, {
      upsert: true,
      new: true
    })
  }
}


module.exports = {
  save
}
