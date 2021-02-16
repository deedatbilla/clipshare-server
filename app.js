require("dotenv").config();
const express = require("express");
// require("./Database/db");
const port = process.env.PORT;
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
const userRouter = require("./Routes/auth");
const deviceRouter = require("./Routes/device");
const clipBoard = require("./Routes/clipBoard");
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

server.listen(port, () => console.log("server running on port:" + port));
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

  socket.on("test1",data=>{
    console.log(data.message)
    socket.broadcast.emit("test2",data) 
   
  }) 
});

app.use(express.json());
app.use(userRouter);
app.use(deviceRouter);
app.use(clipBoard);
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