const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  street: { type:String },
  zipCode: { type: String },
  city: { type: String },
  country: { type: String },
})
const LocationSchema = new mongoose.Schema({
  id: { type:String, unique: true },
  name: {type: String },
  slug: {type: String },
  latitude: {type: String },
  longitude: {type: String },
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
  brandId: { type: String },
}, {
  timestamps: true
});

PostSchema.index({ caption: 'text' });


const BrandSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  username: { type: String },
  fullName: { type: String },
  profilePicture: { type: String },
  post: PostSchema,
  location: LocationSchema,
  options: { type: Array },
  phones: { type: Array },
  rank: { type: Number, default: 0 },
  state: { type: String },
})

BrandSchema.index({ username: 'text', fullName: 'text', 'post.caption': 'text' });


const PostModel = mongoose.model('instagramPost', PostSchema);
const BrandModel = mongoose.model('instagramBrand', BrandSchema);


module.exports = {
  PostModel,
  BrandModel,
}
