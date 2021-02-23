const mongoose = require("mongoose");
const SubscriptionSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    ownerid:{
      type:String,
      required:true
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

module.exports = Subscription;
