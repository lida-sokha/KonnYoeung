const express = require("express");
const router = express.Router();
const { signup, login, verifyOtp, googleLogin, checkAuth, resendOtp, saveHospital, SaveArticle,getUserHistory,forgotPassword, resetPassword } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName: { type: string, example: "Sokha Lida" }
 *               email: { type: string, example: "lida@gmail.com" }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "User created successfully!" }
 *                 data: { type: object }
 *       400:
 *         description: Missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "Missing fields! Please provide name, email, and password." }
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "Database Error: email already exists" }
 */
router.post("/signup", signup);


/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Step 2 - Login with email and password to receive OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email: { type: string, example: "lida@gmail.com" }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: OTP generated and sent successfullyOTP verified successfully. Cookie 'token' has been set.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "OTP sent to your email" }
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "Invalid email or password" }
 *       500:
 *         description: Server error
 */
router.post("/login", login);

/**
 * @swagger
 * /api/users/verify-otp:
 *   post:
 *     summary: Step 3 - Verify OTP and receive JWT Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email: { type: string, example: "lida@gmail.com" }
 *               otp: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "OTP Verified! Login successful." }
 *                 token: { type: string }
 *                 user: { type: object }
 *       400:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "Invalid or expired OTP" }
 *       500:
 *         description: Server error
 */
router.post("/verify-otp", verifyOtp);

/**
 * @swagger
 * /api/users/google:
 *   post:
 *     summary: Step 4 - Google Login/Signup (Auto-verify)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - fullName
 *               - googleId
 *             properties:
 *               email: { type: string, example: "lidasokha@gmail.com" }
 *               fullName: { type: string, example: "Sokha Lida" }
 *               googleId: { type: string, example: "1029384756123" }
 *     responses:
 *       200:
 *         description: Google Login Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Google Login successful" }
 *                 token: { type: string }
 *                 user: { type: object }
 *       500:
 *         description: Server error
 */
router.post("/google-login", googleLogin);

/**
 * @swagger
 * /api/users/check-auth:
 *   get:
 *     summary: Verify if user is logged in via Cookie
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: User is authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *       401:
 *         description: Not authorized (Invalid or missing cookie)
 */
router.get("/check-auth", protect, checkAuth);

/**
 * @swagger
 * /api/users/resend-otp:
 *   post:
 *     summary: Resend OTP to user email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP has been resent to your email
 *       400:
 *         description: User not found or already verified
 *       500:
 *         description: Server error
 */
router.post("/resend-otp", resendOtp);

/**
 * @swagger
 * /api/users/save:
 *   post:
 *     summary: Save a hospital to user's favorites
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hospitalId
 *             properties:
 *               hospitalId:
 *                 type: string
 *                 example: "65f123abc456"
 *     responses:
 *       200:
 *         description: Hospital saved successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/save', protect, saveHospital);

/**
 * @swagger
 * /api/users/saveArticle:
 *   post:
 *     summary: Save an article to user's favorites
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - articleId
 *             properties:
 *               articleId:
 *                 type: string
 *                 example: "article123"
 *     responses:
 *       200:
 *         description: Article saved successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/saveArticle', protect, SaveArticle);

/**
 * @swagger
 * /api/users/history:
 *   get:
 *     summary: Get user's saved hospitals and articles history
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hospitals:
 *                   type: array
 *                   items:
 *                     type: object
 *                 articles:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
router.get("/history", protect, getUserHistory);

/**
 * @swagger
 * /api/users/forgot-password:
 *   post:
 *     summary: Send password reset link to email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "lida@gmail.com"
 *     responses:
 *       200:
 *         description: Reset link sent to email
 *       400:
 *         description: User not found
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/users/reset-password/{resetToken}:
 *   put:
 *     summary: Reset user password using reset token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: resetToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.put('/reset-password/:resetToken', resetPassword);
module.exports = router;
