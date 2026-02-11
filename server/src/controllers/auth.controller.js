const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const { sourceMapsEnabled } = require("process");

// 1. SIGNUP: User created and logged in immediately
exports.signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // 1. Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing fields!" });
    }

    // 2. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ success: false, message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // 3. Create or Update User (upsert handles retries)
    const user = await User.findOneAndUpdate(
      { email },
      { fullName, email, password: hashedPassword, otp, otpExpires, isVerified: false },
      { upsert: true, new: true }
    );

    // 4. Send the Email
    await sendEmail(
      email,
      "Verify your KonnYoeung Account",
      `Your verification code is: ${otp}. It expires in 10 minutes.`
    );

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify to continue."
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error: " + err.message });
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

    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    // Mark as verified
    user.isVerified = true;
    user.otp = undefined; // Clear OTP
    user.otpExpires = undefined;
    await user.save();

    // 5. NOW generate the Token and Cookie
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

    res.status(200).json({
      success: true,
      message: "Email verified! You are now logged in.",
      user: { id: user._id, fullName: user.fullName, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. GOOGLE LOGIN: Auto-verify and issue JWT
exports.googleLogin = async (req, res) => {
  try {
    const { email, fullName, googleId } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName,
        email,
        googleId,
        isVerified: true, // Auto-verify Google users
        password: Math.random().toString(36).slice(-10), // Random password placeholder
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: "Google Login successful",
      user: { id: user._id, fullName: user.fullName, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!User) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = newotp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail(
      email,
      "Your New Verification Code",
      `Your new verification code is: ${newOtp}. It expires in 10 minutes.`
    );
    res.status(200).json({
      success: true, message: "A new OTP has been sent!"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};