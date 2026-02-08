const express = require("express");
const router = express.Router();
const { signup, login, verifyOtp, googleLogin, checkAuth } = require("../controllers/auth.controller");
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
 *         description: OTP generated and sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "OTP sent to your email (check console log)" }
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
router.post("/google", googleLogin);

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
module.exports = router;
