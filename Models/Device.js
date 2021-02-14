const mongoose = require("mongoose");

const DeviceSchema = mongoose.Schema({
  os: {
    type: String,
    required: true,
  },

  mac: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  ownerid: {
    type: String,
    required: true,
    
  },
});

const Device = mongoose.model("Phone", DeviceSchema);

module.exports = Device;
