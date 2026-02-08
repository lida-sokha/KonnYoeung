const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");

// 1. SIGNUP: User created and logged in immediately
exports.signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing fields! Please provide name, email, and password."
      });
    }

    // Check if user already exists (Good practice to prevent crashes)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user (Setting isVerified to true to allow immediate access)
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      isVerified: true
    });

    // Generate JWT Token so they don't have to login again
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "temp_secret",
      { expiresIn: "1d" }
    );

    res.cookie("token", token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    // SUCCESS: Send token and user data
    res.status(201).json({
      success: true,
      message: "User created successfully!",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Database Error: " + err.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // 1. Validate User
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // 2. Generate the OTP ONLY ONCE
    const currentOtp = generateOTP(); 

    // 3. Update User Object
    user.otp = currentOtp;
    user.otpExpires = Date.now() + 600000; // 10 minutes

    // 4. SAVE TO DATABASE (Wait for this to finish)
    await user.save();

    // 5. SEND EMAIL using the SAME variable
    const emailText = `Your KonnYoeung verification code is: ${currentOtp}. It expires in 10 minutes.`;
    await sendEmail(user.email, "Your Login Verification Code", emailText);

    res.status(200).json({ 
      success: true, 
      message: "OTP sent to your email!" 
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. VERIFY OTP: Set isVerified=true and issue JWT
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // 1. Find user with matching email, OTP, and check if not expired
    const user = await User.findOne({ 
      email, 
      otp, 
      otpExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired OTP" 
      });
    }

    // 2. Clear OTP fields and verify user
    user.isVerified = true;
    user.otp = undefined; 
    user.otpExpires = undefined;
    await user.save();

    // 3. Create JWT Token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'your_secret_key', 
      { expiresIn: '1d' }
    );

    // 4. Send SUCCESS response
    res.status(200).json({ 
      success: true,
      message: "OTP Verified! Login successful.",
      token,
      user: { 
        id: user._id, 
        fullName: user.fullName, 
        email: user.email, 
        isVerified: user.isVerified 
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error: " + err.message 
    });
  }
};

// 4. GOOGLE LOGIN: Auto-verify and issue JWT
exports.googleLogin = async (req, res) => {
  try {
    const { email, fullName, googleId } = req.body;

    // 1. Check if user exists by email
    let user = await User.findOne({ email });

    if (!user) {
      // 2. Create new user if they don't exist
      user = await User.create({
        email,
        fullName,
        googleId,
        isVerified: true, // Google accounts are pre-verified
        role: "parent"
      });
    } else {
      // 3. If user exists but doesn't have a googleId, link it
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true;
        await user.save();
      }
    }

    // 4. Create JWT Token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'your_secret_key', 
      { expiresIn: '1d' }
    );

    res.status(200).json({ 
      success: true,
      message: "Google Login successful", 
      token, 
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Google Login Failed: " + err.message 
    });
  }
}; 

// --- Add this at the very end of auth.controller.js ---

exports.checkAuth = async (req, res) => {
  try {
    // req.user is already verified and attached by the 'protect' middleware
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error in checkAuth: " + error.message
    });
  }
};