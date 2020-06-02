const mongoose = require('mongoose');

/*
  type 
    1 - passenger_vehicle_lanes
    2 - pedestrian_lanes

  entry
    1 - standard_lanes
    2 - NEXUS_SENTRI_lanes
    3 - ready_lanes
*/
const Schema = new mongoose.Schema({
  portId: { type: Number },
  city: { type: String },
  name: { type: String },
  portStatus: { type: String },
  type: { type: Number },
  entry: { type: Number },
  lastUpdate: { type: String },
  status: { type: String },
  delay: { type: Number },
  lanes: { type: Number },
  uuid: { type: String },
}, {
  timestamps: true
});

const Model = mongoose.model('port', Schema);

module.exports = Model
