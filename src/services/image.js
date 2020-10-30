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

async function uploadImage(file) {
  return new Promise(resolve => {
    cloudinary.uploader.upload(file.path, {
        tags: 'basic_sample'
      })
      .then(function (image) {
        console.log("* " + image.public_id);
        console.log("* " + image.url);
        resolve(image.url)
      })
      .catch(function (err) {
        if (err) {
          console.warn(err);
        }
        resolve(err)
      });
  })
}

async function save(image, params) {
  const {
    entity,
    id
  } = params

  const response = await uploadImage(image)

  if (entity === 'migrimap') {
    return MigrimapModel.findOneAndUpdate({
      _id: id
    }, {
      image: response
    }, {
      upsert: true,
      new: true
    })
  }
}


module.exports = {
  save
}
