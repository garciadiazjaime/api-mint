const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  todo: { type: String },
  position: { type: Number },
  state: { type: Boolean, default: false },
}, {
  timestamps: true
});

Schema.index({ todo: 'text' });

const Model = mongoose.model('todo', Schema);

module.exports = Model
