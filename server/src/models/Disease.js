const mongoose = require("mongoose");

const diseaseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        severityLevel: {    
            type: String,
            enum: ["Low", "Moderate", "High", "Low to High"]
        },

        symptoms: {
            type: [String],
            default: []
        },

        whenToSeek: {
            type: [String],
            default: []
        },

        whatToDo: {
            type: [String],
            default: []
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Disease", diseaseSchema, "Disease");