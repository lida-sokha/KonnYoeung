const Hospital = require("../models/Hospital");
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RecentActivity = require('../models/RecentActivity');
exports.getAllHospital = async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        console.log("Hospitals found in DB:", hospitals.length);
        // If it finds 51 but fails here, it's a JSON structure issue
        res.status(200).json(hospitals); 
    } catch (error) {
        console.error("Backend Controller Error:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.addHospital = async (req, res) => {
    try {
        const newHospital = new Hospital(req.body);
        const savedHospital = await newHospital.save();
        res.status(201).json(savedHospital);
    } catch (error) {
        res.status(400).json({ message: "Error creating hospital", error: error.message });
    }
};

exports.getHospitalById = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) return res.status(404).json({ message: "Hospital not found" });

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const userId = decoded.id || decoded._id;

                if (userId) {
                    await RecentActivity.create({
                        user: userId,
                        actionType: 'VIEWED_HOSPITAL',
                        metadata: {
                            title: hospital.name,
                            entityId: hospital._id,
                            link: `/hospitals/${hospital._id}`
                        }
                    });
                    console.log(`Hospital activity saved for user: ${userId}`);
                }
            } catch (err) {
                console.log("Hospital view recorded as guest (token error)");
            }
        }

        res.status(200).json(hospital);
    } catch (error) {
        console.error("Hospital Controller Error:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};