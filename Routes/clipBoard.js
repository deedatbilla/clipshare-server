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
    // console.log(error.message);
  }
});

router.post("/clipBoardList", auth, async (req, res) => {
  // fetch clipboard for user
  // let {ownerid}=JSON.parse(req.body)
  let s=JSON.stringify(req.body)
  let p=JSON.parse(s)
  try {
    console.log(s,p);
    console.log(req)
    const clipBoard = await ClipBoard.find(p);
    if (!clipBoard) {
      console.log("no clipboard found")
      return res.status(401).send({ error: "no ClipBoards were found" });
      
    } 
  // res.send("ok")
   return res.status(200).send({ clipBoards:clipBoard, message: "ClipBoard list retrieved successfully!" });
  } catch (error) {
    // console.log(error.message,JSON.stringify(req.body));
   return res.status(400).send(error.message);
    
  }
});

module.exports = router;
