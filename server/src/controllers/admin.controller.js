const User = require("../models/User");

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find();
        console.log("users found in DB:", users.length);
        res.status(200).json(users);
    } catch (error) {
        console.error("Backend controller Error: ", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}