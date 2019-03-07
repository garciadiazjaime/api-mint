const mongoose = require('mongoose');

const CaptionSchema = new mongoose.Schema({
  captions: Array,
  created: { type: Date, default: Date.now }
});

const CaptionModel = mongoose.model('caption', CaptionSchema);

module.exports = CaptionModel
