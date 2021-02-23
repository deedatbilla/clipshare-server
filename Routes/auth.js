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

router.post("/signup", async (req, res) => {
  // Create a new user
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res
      .status(201)
      .send({
        email: user.email,
        name: user.name,
        id: user._id,
        token: token,
        dateJoined: user.createdAt,
      });
  } catch (error) {
    res.status(400).send(error.message);
    // console.log(error.message);
  }
});

router.post("/get_latest_subscription", auth, async (req, res) => {
  // get subscriptions
  try {
    const subscriptions =await Subscription.find(req.body);

    res.status(200).send({ latest: subscriptions[subscriptions.length-1] });
  } catch (error) {
    res.status(400).send(error.message);
    // console.log(error.message);
  }
});
// console.log(new Date())
router.post("/create_subscription", auth, async (req, res) => {
  // create subscriptions
  try {
    var hash = req.headers["verif-hash"];
  
  if(!hash) {
    console.log("no hash")
    // discard the request,only a post with the right Flutterwave signature header gets our attention 
  }
  
  // Get signature stored as env variable on your server
  const secret_hash = process.env.VERIFY_PAYMENT_HASH;
  
  // check if signatures match
  
  if(hash !== secret_hash) {

    return
   // silently exit, or check that you are passing the right hash on your server.
  }
    // let  oneYearFromNow = new Date();
    console.log(req.body)
    // const {amount,email}=req.body
    // const payload={
    //   endDate: oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1),
    //   startDate:new Date(),
    //   amount,
    //   email,
    // }
    // const sub = new Subscription(payload);

    // await sub.save()
    res.status(201).send({ subscription: "Dsf" });
  } catch (error) {
    res.status(400).send(error.message);
    // console.log(error.message);
  }
});


router.post("/signin", cors(corsOptionsDelegate), async (req, res) => {
  //Login a registered user
  try {
    const { email, password } = req.body;

    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    res
      .status(200)
      .send({
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
