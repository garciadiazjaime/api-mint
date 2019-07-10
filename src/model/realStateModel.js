const mongoose = require('mongoose');

const RealStateSchema = new mongoose.Schema({
  price: { type: String },
  currency: { type: String },
  description: { type: String },
  latitude: { type: String },
  longitude: { type: String },
  image: { type: String },
  url: { type: String, unique: true },
  address: { type: String },
  city: { type: String },
  source: { type: String },
  created: { type: Date, default: Date.now }
});

const RealStateModel = mongoose.model('realStatePlace', RealStateSchema);

module.exports = RealStateModel
