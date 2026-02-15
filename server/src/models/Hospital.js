// backend/models/Hospital.js
const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    province: { type: String, required: true },
    address: { type: String, required: true },
    // Use Number for these flat fields from your JSON/Compass
    latitude: { type: Number, required: true }, 
    longitude: { type: Number, required: true },
    phone_number: String,
    email: String,
    website: String,
    facebook_page: String,
    is_24h_service: { type: Boolean, default: false }
}, { timestamps: true });

// Use the exact collection name "Hospitals" from your Compass screenshot
module.exports = mongoose.model("Hospital", hospitalSchema, "Hospitals");