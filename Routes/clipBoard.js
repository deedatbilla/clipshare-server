const express = require("express");
const ClipBoard = require("../Models/ClipBoard");
const auth = require("../Middleware/auth");
const router = express.Router();
router.post("/addClipBoard", auth, async (req, res) => {
  // Create a new ClipBoard
  try {
    const clipBoard = new ClipBoard(req.body);
    await clipBoard.save();
    res.status(201).send({ clipBoard });
  } catch (error) {
    res.status(400).send(error.message);
    // console.log(error.message);
  }
});

router.post("/clipBoardList", auth, async (req, res) => {
  // fetch clipboard for user
  try {
    const clipBoard = await ClipBoard.find(req.body);
    if (!clipBoard) {
      return res.status(401).send({ error: "no ClipBoards were found" });
    }
    res.send({ clipBoards:clipBoard, message: "ClipBoard list retrieved successfully!" });
  } catch (error) {
    res.status(400).send(error.message);
    // console.log(error.message);
  }
});

module.exports = router;
