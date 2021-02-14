const express = require("express");
const Device = require("../Models/Device");
const auth = require("../Middleware/auth");
const router = express.Router();
router.post("/addDevice", auth, async (req, res) => {
  // Create a new device
  try {
    const device = new Device(req.body);
    await device.save();
    res.status(201).send({ device });
  } catch (error) {
    res.status(400).send(error.message);
    // console.log(error.message);
  }
});

router.post("/deviceList", auth, async (req, res) => {
  // Create a new device
  try {
    const device = await Device.find(req.body);
    if (!device) {
      return res.status(401).send({ error: "no devices were found" });
    }

    res.send({ devices:device, message: "device list retrieved successfully!" });
  } catch (error) {
    res.status(400).send(error.message);
    // console.log(error.message);
  }
});

module.exports = router;
