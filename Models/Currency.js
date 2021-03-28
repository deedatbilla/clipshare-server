const mongoose = require("mongoose");
const CurrencySchema = mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
     
    },

    symbol: { 
        type: String,
        required: true,
        
      },
    chargePerYear: {
      type: Number,
      required: true,
    },

    chargeLifetime: {
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
