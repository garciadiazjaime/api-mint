const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  street: {type:String},
  zipCode: {type: String},
  city: {type: String},
  country: {type: String}
})
const LocationSchema = new mongoose.Schema({
  id: { type:String, unique: true},
  name: {type: String},
  slug: {type: String},
  latitude: {type: String},
  longitude: {type: String},
  address: AddressSchema,
})


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
  userId: { type: String },
}, {
  timestamps: true
});

PostSchema.index({ id: 'text' });


const UserSchema = new mongoose.Schema({
  id: { type: String, unique: true},
  username: {type: String},
  fullName: {type: String},
  profilePicture: {type: String},
  post: PostSchema,
  location: LocationSchema
})


const PostModel = mongoose.model('instagramPost', PostSchema);
const UserModel = mongoose.model('instagramUser', UserSchema);


module.exports = {
  PostModel,
  UserModel,
}
