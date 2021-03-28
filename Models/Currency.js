const mongoose = require("mongoose");
const CurrencySchema = mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
      unique: true,
    },

    symbol: {
        type: String,
        required: true,
        unique: true,
      },
    charge: {
      type: Number,
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

const Currency = mongoose.model("Currency", CurrencySchema);

module.exports = Currency;
