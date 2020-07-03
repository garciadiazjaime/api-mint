const mongoose = require('mongoose');

const WordSchema = new mongoose.Schema({
  term: { type: String, unique: true },
  definitions: { type: Array },
  lang: { type: String }
}, {
  timestamps: true
});

WordSchema.index({ term: 'text' });

const WordModel = mongoose.model('word', WordSchema);

module.exports = WordModel
