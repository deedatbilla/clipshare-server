const AdminBro = require("admin-bro");
const AdminBroExpress = require("@admin-bro/express");
// require("../Database/db");
const mongoose = require("mongoose");
const Admin = require("../Models/Admin");
const express = require("express");
const AdminBroMongoose = require("@admin-bro/mongoose");
const clipBoard = require("../Models/ClipBoard");
const Subscription = require("../Models/Subscription");
const User = require("../Models/User");
AdminBro.registerAdapter(AdminBroMongoose);
// const User = mongoose.model('User', { name: String, email: String, surname: String })
const app = express();
const adminBro = new AdminBro({
  // databases: [],
  //   rootPath: "/admin",
  resources: [ User, Subscription,Admin],
});

// const router = AdminBroExpress.buildRouter(adminBro);
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const admin = await Admin.findByCredentials(email, password);
    if (admin) {
      return admin;
    }
    return false;
  },
  cookiePassword: "some-secret-password-used-to-secure-cookie",
});



module.exports = {router,adminBro};
// app.use(adminBro.options.rootPath, router);

// app.listen(8080, () => console.log("AdminBro is under localhost:8080/admin"));
