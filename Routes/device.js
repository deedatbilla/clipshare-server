const express = require("express");
const Device=require('../Models/Device')
const auth = require("../Middleware/auth");
const router = express.Router();




router.post("/addDevice",auth, async (req, res) => {
  // Create a new device
  try {
    const user = new Device(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
    // console.log(error.message);
  }
});





module.exports = router;
