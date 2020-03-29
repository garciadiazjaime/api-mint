const mongoose = require('mongoose');

const RealStateSchema = new mongoose.Schema({
  price: { type: Number },
  currency: { type: String },
  description: { type: String },
  latitude: { type: String },
  longitude: { type: String },
  images: { type: Array },
  url: { type: String, unique: true },
  address: { type: String },
  city: { type: String },
  source: { type: String }
}, {
  timestamps: true
});

RealStateSchema.index({ description: 'text', address: 'text'});


const RealStateModel = mongoose.model('realStatePlace', RealStateSchema);

module.exports = RealStateModel
