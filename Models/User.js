const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error({ error: "Invalid Email address" });
        }
      },
    },

    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    resetPasswordToken: {
      type: String,
      required: false
  },

  resetPasswordExpires: {
      type: Date,
      required: false
  },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

userSchema.pre("save", async function (next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.generatePasswordReset = function() {
  const user = this;
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

userSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.

  try {
    const user = await User.findOne({email });
    // console.log(user,"dsfd")
    if (!user) {
      // console.log("no user")
      throw new Error({ error: "Invalid login credentials" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      // console.log(isPasswordMatch,"fd")
      throw new Error({ error: "Invalid login credentials" });
    }
    return user;
  } catch (error) {}
};


const User = mongoose.model("User", userSchema);
mongoose.set('useFindAndModify', false);
module.exports = User;
