const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  name: { type: String },
  party: { type: String },
  partyImageURL: { type: String},
  profileURL: { type: String, unique: true },
  pictureURL: { type: String },
  type: { type: String },
  state: { type: String },
  circunscripcion: { type: String },
  district: { type: Number },
  email: { type: String },
  startDate: { type: String },
  status: { type: Boolean },
  role: { type: String }
}, {
  timestamps: true
});

Schema.index({ name: 'text' });

const Model = mongoose.model('politician', Schema);

module.exports = {
  Politician: Model
}
