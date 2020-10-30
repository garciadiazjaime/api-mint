const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  profile: { type: String },
  address: { type: String },
  gmaps: { type: String },
  phone: { type: String },
  servicesFree: { type: String },
  servicesNonFree: { type: String },
  img: { type: String },
  website: { type: String },
  socialNetwork: { type: String },
  ceo: { type: String },
  owner: { type: String },
  language: { type: String },
  schedule: { type: String },
  capacity: { type: String },
  population: { type: String },
  category: { type: String },
  image: { type: String },
}, {
  timestamps: true
});

const Model = mongoose.model('migriplace', Schema);

module.exports = {
  Place: Model
}
