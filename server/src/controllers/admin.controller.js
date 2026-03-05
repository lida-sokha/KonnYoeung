const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require("../models/User");

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Backend controller Error: ", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
exports.createUser = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing fields!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role: (role === "admin" || role === "parent") ? role : "parent",
            isVerified: true
        });
        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Backend createUser Error: ", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        

        await User.findByIdAndDelete(id);

        res.status(200).json({ 
            success: true, 
            message: `User ${user.fullName} deleted successfully` 
        });

    }catch (error) {
        console.error("Backend deleteUser Error: ", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}