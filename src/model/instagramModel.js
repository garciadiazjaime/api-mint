const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: { type: String, unique: true},
  username: {type: String},
  fullMame: {type: String},
  profilePicture: {type: String}
})

const UserModel = mongoose.model('instagramUser', UserSchema);


const AddressSchema = new mongoose.Schema({
  street: {type:String},
  zipCode: {type: String},
  city: {type: String},
  country: {type: String}
})
const LocationSchema = new mongoose.Schema({
  id: { type:String, unique: true},
  name: {type: String},
  slug: {type: String, unique: true},
  address: AddressSchema
})

const LocationModel = mongoose.model('instagramLocation', LocationSchema);


const PostSchema = new mongoose.Schema({
  commentsCount: { type: Number },
  permalink: { type: String },
  mediaType: { type: String },
  mediaUrl: { type: String },
  caption: { type: String },
  id: { type: String, unique: true },
  likeCount: { type: Number },
  children: { type: Array },
  city: { type: String },
  source: { type: String },
  state: { type: String },
  user: UserSchema,
  location: LocationSchema
}, {
  timestamps: true
});

PostSchema.index({ id: 'text' });

const PostModel = mongoose.model('instagramPost', PostSchema);


module.exports = {
  PostModel,
  UserModel,
  LocationModel
}
