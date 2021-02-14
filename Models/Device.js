const mongoose = require("mongoose");
const DeviceSchema = mongoose.Schema(
  {
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
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const Device = mongoose.model("Device", DeviceSchema);

module.exports = Device;
