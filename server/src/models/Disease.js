const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: false,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    severityLevel: {
      type: String,
      default: 'Moderate',
      trim: true,
    },
    severity: {
      type: String,
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

// Use the existing MongoDB collection name exactly (capital D) so we read the 'Disease' table with all 34 records.
module.exports = mongoose.model('Disease', diseaseSchema, 'Disease');
