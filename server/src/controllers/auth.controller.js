const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const { sourceMapsEnabled } = require("process");
const RecentActivity = require("../models/RecentActivity");
const crypto = require('crypto');
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
    await sendEmail({
      email: email,
      subject: "Verify your KonnYoeung Account",
      text: `Your verification code is: ${otp}. It expires in 10 minutes.`,
      // Optional: add html if you want it to look pretty
      html: `
        <div style="font-family: sans-serif; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px;">
          <h2 style="color: #34AADC;">Verify your KonnYoeung Account</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 5px; color: #1e293b;">${otp}</h1>
          <p style="font-size: 12px; color: #64748b;">This code expires in 10 minutes.</p>
        </div>
      `
    });

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
      return res.status(401).json({ success: false, message: "Wrong password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: "Please verify your email first" });
    }
    const isAdmin = user.role === "admin";

    if (user.isVerified) {
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role
        },
        process.env.JWT_SECRET || "temp_secret",
        { expiresIn: "1d" }
      );
      res.cookie("token", token, {
      httpOnly: true,
      secure: true, 
      sameSite: "None", 
      maxAge: 24 * 60 * 60 * 1000
    });

      return res.status(200).json({
        success: true,
        message: isAdmin ? "Admin login successful" : "Login successful",
        token, 
        user: { id: user._id, fullName: user.fullName, email: user.email , role:user.role}
      });
    }

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
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
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

    // 1. Find the user by email
    let user = await User.findOne({ email });

    if (user) {
      // SECURITY CHECK: 
      // If the user exists but doesn't have a googleId, they originally signed up with a password.
      // We link the account by adding the googleId now.
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true; // Google users are pre-verified
        await user.save();
      } 
      // If they HAVE a googleId, ensure it matches the one sent from the frontend
      else if (user.googleId !== googleId) {
        return res.status(401).json({ 
          success: false, 
          message: "Google ID mismatch. Please contact support." 
        });
      }
    } else {
      // 2. Create a new user if they don't exist
      user = await User.create({
        fullName,
        email,
        googleId,
        isVerified: true,
        // Using a random string for password is fine, 
        // but ensure your Schema doesn't require a specific password format
        password: Math.random().toString(36).slice(-10) + Date.now(),
      });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    // 4. Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // "None" is required for cross-domain cookies in production
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { 
        id: user._id, 
        fullName: user.fullName, 
        email: user.email 
      }
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- Add this at the very end of auth.controller.js ---
exports.checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate('savedHospitals').populate("savedArticles"); 

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: user // Now this contains email, fullName, etc.
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message
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
    user.otp = newOtp;
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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; 

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // 1. Fixed the variable name here to match what you pass below
    const htmlMessage = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password. This link expires in 15 minutes.</p>
      <a href="${resetUrl}" clicktracking="off">Reset the Passwords</a>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            html: htmlMessage, // 2. Matches the variable above now
        });
        
        res.status(200).json({ success: true, message: "Email sent" });
    } catch (err) {
      // Clear the tokens if email fails so they don't sit in the DB
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      console.error("Mail Error:", err.message); // Helpful for debugging backend logs
      return res.status(500).json({ success: false, message: "Email could not be sent" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Reset actual password in DB
exports.resetPassword = async (req, res) => {
  try {
    // Hash the token from the URL to compare with DB
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    // Set new password
    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ success: true, message: "Password reset success" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.saveHospital = async (req, res) => {
  try {
    const { hospitalId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    
    const isAlreadySaved = user.savedHospitals.some(id => id.toString() === hospitalId);

    const update = isAlreadySaved 
      ? { $pull: { savedHospitals: hospitalId } } 
      : { $addToSet: { savedHospitals: hospitalId } };

    await User.findByIdAndUpdate(userId, update);

    res.status(200).json({ 
        success: true, 
        message: isAlreadySaved ? "Removed" : "Saved" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.SaveArticle = async (req, res) => {
  try {
    const { articleId } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    const isAlreadySaved = user.savedArticles.some(id => id.toString() === articleId);

   const update = isAlreadySaved 
      ? { $pull: { savedArticles: articleId } } 
      : { $addToSet: { savedArticles: articleId } };
    
    await User.findByIdAndUpdate(userId, update); 
    res.status(200).json({
      success: true,
      message: isAlreadySaved ? "Removed" : "Saved"
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email, language, newPassword } = req.body;
    const userId = req.user.id;

    const updateData = { fullName, email, language };

    // If the user is trying to change their password
    if (newPassword) {
      const bcrypt = require('bcrypt');
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserHistory = async (req, res) => {
    try {
        let userId = null;
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id || decoded._id;
        }

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not identified" });
        }

        const activities = await RecentActivity.find({ user: userId })
            .sort({ createdAt: -1 }) 
            .limit(10);

        res.status(200).json({
            success: true,
            data: activities
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};