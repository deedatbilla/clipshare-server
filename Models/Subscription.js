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
    email:{
      type:String,
      required:true
    },
    txRef:{
      type:String,
      required:true
    },
    type:{
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
