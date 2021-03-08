const express = require("express");
const User = require("../Models/User");
const Subscription = require("../Models/Subscription");
const auth = require("../Middleware/auth");
const router = express.Router();
var cors = require("cors");
var whitelist = ["http://localhost:3000"];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: true }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

router.get("/", (req, res) => {
  res.send({ message: "app" });
});
// console.log(new Date(Date.now() + 12096e5))
router.post("/signup", async (req, res) => {
  // Create a new user
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    var fortnightAway = new Date(Date.now() + 12096e5);
    const payload = {
      endDate: fortnightAway,
      startDate: new Date(),
      amount: 0,
      email: user.email,
      txRef: new Date().getTime(),
      type: "free",
    };
    const sub = new Subscription(payload);
    await sub.save();
    res.status(201).send({
      email: user.email,
      name: user.name,
      id: user._id,
      token: token,
      dateJoined: user.createdAt,
    });
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error.message);
  }
});

router.post("/get_latest_subscription", auth, async (req, res) => {
  // get subscriptions
  try {
    const subscriptions = await Subscription.find(req.body);
    if (!subscriptions) {
      return res.status(401).send({ error: "no subscription was found" });
    }
    res.status(200).send({ subscriptions });
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error.message);
  }
});
// console.log(new Date())
router.post("/create_subscription", async (req, res) => {
  // create subscriptions
  try {
    console.log(req.body);
    var hash = req.headers["verif-hash"];
    if (!hash) {
      return;
    }
    // Get signature stored as env variable on your server
    const secret_hash = process.env.VERIFY_PAYMENT_HASH;
    // check if signatures match
    if (hash !== secret_hash) {
      return;
    }

    let oneYearFromNow = new Date();
    let temp = JSON.stringify(req.body);
    var request_json = JSON.parse(temp);
    if (request_json.data) {
      const { data } = request_json;
      const { tx_ref, amount, status, customer, payment_type, card } = data;
      // const { email } = customer;
      if (status === "successful" && payment_type === "card") {
        const payload = {
          endDate: oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1),
          startDate: new Date(),
          amount,
          email:customer.email,
          txRef:tx_ref,
          type: amount === 10 ? "yearly" : "lifetime",
          meta: JSON.stringify(card),
        };

        const sub = new Subscription(payload);
        await sub.save();
        return res.status(200).send({ sub });
      }
    }

    const { txRef, amount, customer } = request_json;
    const payload = {
      endDate: oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1),
      startDate: new Date(),
      amount,
      email: customer.email,
      txRef,
      type: amount === 10 ? "yearly" : "lifetime",
    };
    const sub = new Subscription(payload);
    await sub.save();
    return res.status(200).send({ sub });
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error.message);
  }
});

router.post("/signin", async (req, res) => {
  //Login a registered user
  try {
    const { email, password } = req.body;
    // console.log(req.body)

    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    res.status(200).send({
      email: user.email,
      name: user.name,
      id: user._id,
      token: token,
      dateJoined: user.createdAt,
    });
  } catch (error) {
    res.status(400).send({ error });
    // console.log(error.message)
  }
});

router.get("/users/me", auth, async (req, res) => {
  // View logged in user profile
  res.send(req.user);
});

router.post("/logout", auth, async (req, res) => {
  // Log user out of the application
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post(
  "/users/logoutall",
  cors(corsOptionsDelegate),
  auth,
  async (req, res) => {
    // Log user out of all devices
    try {
      req.user.tokens.splice(0, req.user.tokens.length);
      await req.user.save();
      res.send();
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

module.exports = router;
