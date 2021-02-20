// var MongoClient = require('mongodb').MongoClient;
const mongoose = require("mongoose");
const url = process.env.LIVE_DB_URL;
mongoose.connect(url, { useNewUrlParser: true,useCreateIndex:true,useUnifiedTopology:true });
const db = mongoose.connection;
db.once("open", (_) => {
  // console.log("Database connected:", url);
});

// db.on("error", (err) => {
//   console.error("connection error:", err);
// });
//  const dbName = 'Clypsync'
//  MongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology:true }, (err, client) => {
//     if (err) return console.log(err)
//     // Storing a reference to the database so you can use it later
//     db = client.db(dbName)
//     console.log(`Connected MongoDB: ${url}`)
//     console.log(`Database: ${dbName}`)
//   })
