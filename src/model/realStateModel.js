const mongoose = require('mongoose');

const { gps } = require('./shared')

const RealStateSchema = new mongoose.Schema({
  price: { type: Number },
  currency: { type: String },
  description: { type: String },
  gps,
  images: { type: Array },
  url: { type: String, unique: true },
  address: { type: String },
  city: { type: String },
  source: { type: String }
}, {
  timestamps: true
});

RealStateSchema.index({ description: 'text', address: 'text'});
RealStateSchema.index({ gps: "2dsphere" });


const RealStateModel = mongoose.model('realStatePlace', RealStateSchema);

module.exports = RealStateModel
