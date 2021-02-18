const mongoose = require("mongoose");
const DeviceSchema = mongoose.Schema(
  {
    os: {
      type: String,
      required: true,
    },
//mac address
    mac: {
      type: String,
      required: true,
    },
    //name of device
    name: {
      type: String,
      required: true,
    },

    //whether pc or phone
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
