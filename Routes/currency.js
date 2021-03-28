const express = require("express");
const Currency = require("../Models/Currency");
const auth = require("../Middleware/auth");
const router = express.Router();
router.post("/addCurrency", auth, async (req, res) => {
  // Create a new currency
  const {charge,symbol,country}=req.body
  try {
    const currency = new Currency({country,symbol,charge});
    await currency.save();
    res.status(201).send({ currency });
  } catch (error) {
    res.status(400).send(error.message);
    // console.log(error.message);
  }
});

router.post("/currencyList", auth, async (req, res) => {
  try {
    const currency = await Currency.find()
    if (!currency) {
      return res.status(401).send({ error: "no currencies were found" });
    }
    res.status(200).send({ currencies:currency, message: "currencies list retrieved successfully!" });
  } catch (error) {
    res.status(400).send(error.message);
    // console.log(error.message);
  }
});

module.exports = router;
