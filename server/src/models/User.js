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
      required: true
    },
    role: {
      type: String,
      enum: ["parent", "admin"],
      default: "parent"
    }
  },
  {
    timestamps: true // creates createdAt & updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);
