const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      default: 'Moderate',
      trim: true,
    },
    summary: {
      type: String,
      default: '',
      trim: true,
    },
    commonSymptoms: {
      type: [String],
      default: [],
    },
    seekCareWhen: {
      type: [String],
      default: [],
    },
    whatToDo: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Disease', diseaseSchema);
