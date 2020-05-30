const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  portId: { type: String },
  city: { type: String },
  name: { type: String },
  portStatus: { type: String },
  type: { type: String },
  entry: { type: String },
  lastUpdate: { type: String },
  status: { type: String },
  delay: { type: Number },
  lanes: { type: Number },
}, {
  timestamps: true
});

const Model = mongoose.model('port', Schema);

module.exports = Model
