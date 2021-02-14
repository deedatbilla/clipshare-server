const mongoose = require("mongoose");
const ClipBoardSchema = mongoose.Schema(
  {
    clipdata: {
      type: String,
      required: true,
    },

    from: {
      type: String,
      required: true,
    },
    to: {
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

const ClipBoard = mongoose.model("ClipBoard", ClipBoardSchema);

module.exports = ClipBoard;
