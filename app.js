require("dotenv").config();
const express = require("express");
require("./Database/db");
var bodyParser = require("body-parser");
var cors = require("cors");
const port = process.env.PORT;
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {},
});

const userRouter = require("./Routes/auth");
const deviceRouter = require("./Routes/device");
const clipBoard = require("./Routes/clipBoard");
const { router: adminBroRouter, adminBro } = require("./Routes/AdminBroRoute");
server.listen(port, () => console.log("server running on port:" + port));
let numUsers = 0;
io.on("connection", (socket) => {
  let addedUser = false;
  socket.on("userConnected", (email) => {
    if (addedUser) return;
    // we store the username in the socket session for this client
    console.log("connected");
    socket.email = email;
    ++numUsers;
    addedUser = true;
    socket.emit("numUsers", {
      numUsers: numUsers,
    });
  });
  //when user sends clipboard from phone to pcs
  //phone will emit the user's id, clipboard data and pc list
  //pcs will be listening here
  socket.on("from_phone", (data) => {
    const { email, clip } = JSON.parse(data);
    // socket.on(`user-pc${userid}`,)
    console.log(email, "from phone");
    socket.broadcast.emit(`to_pc-${email}`, JSON.parse(data));
  });


  //when user sends clipboard from pc to phone
  //pc will emit on the from pc channel,
  //phone will listen from this channel
  socket.on("from_pc", (data) => {
    const { email, clip } = data;
    console.log(data);

    socket.broadcast.emit(`to_phone-${email}`, clip);
  });
  socket.on("to_pc_success", (data) => {
    const { email } = data;
    // console.log("hehehe")
    socket.broadcast.emit(`to_pc_success-${email}`, data);
  });
  socket.on("test1", (data) => {
    console.log(data.message);
    socket.broadcast.emit("test2", data);
  });
});

app.use(function (req, res, next) {
  // console.log(req.header)
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());
app.use(userRouter);
app.use(adminBro.options.rootPath, adminBroRouter);
app.use(deviceRouter);
app.use(clipBoard);
app.use(cors());
// app.use(bodyParser.json())
// app.use("/public", express.static("public"));
app.use((req, res, next) => {
  // Error goes via `next()` method
  setImmediate(() => {
    next(new Error("Something went wrong"));
  });
});
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
