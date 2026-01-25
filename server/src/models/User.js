const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: false // Changed to false to allow Google Sign-in
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true // Allows multiple users to NOT have a googleId
    },
    otp: String,
    otpExpires: Date,
    isVerified: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ["parent", "admin"],
      default: "parent"
    }
  },
  {
    timestamps: true 
  }
);

module.exports = mongoose.model('User', userSchema);