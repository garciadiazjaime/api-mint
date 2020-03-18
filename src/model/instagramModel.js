const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
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
  state: { type: String }
}, {
  timestamps: true
});

Schema.index({ id: 'text' });

const Model = mongoose.model('instagramPost', Schema);

module.exports = Model
