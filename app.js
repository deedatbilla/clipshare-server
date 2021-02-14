require("dotenv").config();
const express = require("express");
require("./Database/db");
const userRouter = require("./Routes/auth");
const deviceRouter = require("./Routes/device");
const clipBoard = require("./Routes/clipBoard");
const port = process.env.PORT;
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
app.use(express.json());
app.use(userRouter);
app.use(deviceRouter);
app.use(clipBoard);
app.use("/public", express.static("public"));
app.use((req, res, next) => {
  // Error goes via `next()` method
  setImmediate(() => {
    next(new Error("Something went wrong"));
  });
});
console.log(process.env.NODE_ENV);
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
const devices = {};
io.on("connection", (socket) => {
  //when user sends clipboard from phone to pcs
  //phone will emit the user's id, clipboard data and pc list
  //pcs will be listening here
  socket.on("from_phone", (data) => {
    const { userid, pcs } = data;
    // socket.on(`user-pc${userid}`,)
    pcs.forEach((element) => {
      socket.broadcast.emit(`to_pc-${element.id}-${userid}`, data);
    });
  });

  // when user sends clipboard from pc to phone
  //pc will emit on the from pc channel,
  //phone will listen from this channel
  socket.on("from_pc", (data) => {
    const { userid, phonesList } = data;
    phonesList.foreach((element) => {
      socket.broadcast.emit(`to_phone-${element.id}-${userid}`, data);
    });
  });
});
