const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },

  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: [true, "Email already exists"],
    validator: [validator.isEmail, "Please enter a valid email"],
  },

  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },

  avatar: {
    public_id: String,
    url: String,
  },

  bio: {
    type: String,
    default: "Available",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  //Request sent
  requested: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  newRequests: {
    type: Number,
    default: 0,
  },

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  saves: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],

  notifications: [
    {
      type: {
        type: String,
        enum: ["like", "comment", "share", "reply", "follow", "other"], // Types of notifications
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId, // Who did this action
        ref: "User",
      },
      post: {
        type: mongoose.Schema.Types.ObjectId, // In which post
        ref: "Post",
      },
      createdAt: {
        type: Date,
        default: Date.now, // Timestamp of the notification
      },
    },
  ],

  newNotifications: {
    type: Number,
    default: 0,
  },

  anonymousPosts: {
    type: Number,
    default: 3,
  },

  profileLock: {
    type: Boolean,
    default: false,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

// Compare Password
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// JWT Token
userSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
