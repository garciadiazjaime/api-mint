const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
  from: String,
  subject: String,
  message: String,
  to: String,
  created: { type: Date, default: Date.now }
});

const EmailModel = mongoose.model('email', EmailSchema);

module.exports = EmailModel
