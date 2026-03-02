const Hospital = require("../models/Hospital");

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
        // req.params.id comes from the URL /api/hospitals/:id
        const hospital = await Hospital.findById(req.params.id);

        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found in database" });
        }

        res.status(200).json(hospital);
    } catch (error) {
        console.error("Error fetching hospital by ID:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};