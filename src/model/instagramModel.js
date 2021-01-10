const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  street: { type:String },
  zipCode: { type: String },
  city: { type: String },
  country: { type: String },
})

const LocationSchema = new mongoose.Schema({
  id: { type:String },
  name: { type: String },
  slug: { type: String },
  gps: {
    type: { type: String },
    coordinates: { type: [], default: undefined }
  },
  address: AddressSchema,
}, {
  timestamps: true
})

LocationSchema.index({ gps: "2dsphere" });

const MetaSchema = new mongoose.Schema({
  options: { type: Array },
  phones: { type: Array },
  rank: { type: Number }
})

const UserSchema = new mongoose.Schema({
  id: { type: String },
  username: { type: String },
  fullName: { type: String },
  profilePicture: { type: String },
  followedBy: { type: String },
  postsCount: { type: String },
}, {
  timestamps: true
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
  state: { type: String }, // [MAPPED, DELETED, BLOCKED]
  published: { type: Boolean, default: false },
  liked: { type: Boolean, default: false },
  lastCheck: { type: Date }, // delete check
  postUpdate: { type: Date }, // update image
  hasLocation: { type: Boolean }, // helps to add location when post does not have one
  hasPhone: { type: Boolean }, // helps to add phone when post does not have one
  invalidImage: { type: Boolean},  // helps to refresh imgs reported by users

  user: UserSchema,
  location: LocationSchema,
  meta: { type: MetaSchema },
}, {
  timestamps: true
});

PostSchema.index({ caption: 'text' });

const PostModel = mongoose.model('instagramPost', PostSchema);
const LocationModel = mongoose.model('instagramLocation', LocationSchema);
const UserModel = mongoose.model('instagramUser', UserSchema)

module.exports = {
  PostModel,
  LocationModel,
  UserModel,
}
