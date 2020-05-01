const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  street: { type:String },
  zipCode: { type: String },
  city: { type: String },
  country: { type: String },
})

const LocationSchema = new mongoose.Schema({
  id: { type:String },
  name: {type: String },
  slug: {type: String },
  latitude: {type: String },
  longitude: {type: String },
  address: AddressSchema,
})

const MetaSchema = new mongoose.Schema({
  options: { type: Array },
  phones: { type: Array },
  rank: { type: Number, default: 0 }
})

const UserSchema = new mongoose.Schema({
  id: { type: String },
  username: { type: String },
  fullName: { type: String },
  profilePicture: { type: String },
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
  published: { type: Boolean, default: false },

  user: UserSchema,
  location: LocationSchema,
  meta: { type: MetaSchema },
}, {
  timestamps: true
});

PostSchema.index({ caption: 'text' });

const PostModel = mongoose.model('instagramPost', PostSchema);
const LocationModel = mongoose.model('instagramLocation', LocationSchema);


module.exports = {
  PostModel,
  LocationModel,
}
