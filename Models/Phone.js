const mongoose = require("mongoose");

const PhoneSchema = mongoose.Schema({
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
  ownerid: {
    type: String,
    required: true,
  },
});

const Phone = mongoose.model("Phone", PhoneSchema);

module.exports = Phone;
