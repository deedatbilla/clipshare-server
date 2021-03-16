const express = require("express");
const ClipBoard = require("../Models/ClipBoard");
const auth = require("../Middleware/auth");
const { json } = require("express");
const router = express.Router();
router.post("/addClipBoard", auth, async (req, res) => {
  // Create a new ClipBoard

  try {
    const clipBoard = new ClipBoard(req.body);
    await clipBoard.save();
    res.status(201).send({ clipBoard });
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error.message);
  }
});

router.post("/deleteAllClips", auth, async (req, res) => {
  // delete all  ClipBoard
  const data = JSON.stringify(req.body);
  const { ownerid } = JSON.parse(data);
  try {
    await ClipBoard.deleteMany({ ownerid });
    res.status(200).send({ status: "clips deleted" });
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error.message);
  }
});

router.post("/deleteClip", auth, async (req, res) => {
  // delete a  ClipBoard
  const data = JSON.stringify(req.body);
  const { id } = JSON.parse(data);
  try {
    await ClipBoard.deleteOne({ _id: id });
    res.status(200).send({ status: "clip deleted" });
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error.message);
  }
});

router.post("/deleteMultipleClips", auth, async (req, res) => {
  // delete a  ClipBoard
  const { clips } = req.body;

  try {
    clips.forEach(async (element) => {
      await ClipBoard.deleteOne({ _id: element });
    });
    res.status(200).send({ status: "clips deleted" });
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error.message);
  }
});

router.post("/clipBoardList", auth, async (req, res) => {
  // fetch clipboard for user
  // let {ownerid}=JSON.parse(req.body)
  // console.log("Sfd")
  let s = JSON.stringify(req.body);
  let p = JSON.parse(s);
  try {
    if (!p.ownerid) {
      return res.status(401).send({ error: "ownerid is required" });
    }
    const clipBoard = await ClipBoard.find(p);
    if (!clipBoard) {
      console.log("no clipboard found");
      return res.status(401).send({ error: "no ClipBoards were found" });
    }
    return res.status(200).send({ clipBoard: clipBoard.reverse() });
  } catch (error) {
    // console.log(error.message,JSON.stringify(req.body));
    return res.status(400).send(error.message);
  }
});

module.exports = router;
