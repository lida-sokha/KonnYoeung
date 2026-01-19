const express = require("express");
const User = require("../models/User");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Test
 *   description: Test routes for KonnYoeung
 */

/**
 * @swagger
 * /api/test/create-user:
 *   get:
 *     summary: Create a test user
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *       500:
 *         description: Server error
 */
router.get("/create-user", async (req, res) => {
  try {
    const user = new User({
      fullName: "Test Parent",
      email: "parent@test.com",
      password: "hashed_password" // later replace with bcrypt hash
    });
    await user.save();
    res.json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/test/users:
 *   get:
 *     summary: Get all users
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 640e4c3f2f1c0a001fabc123
 *                   fullName:
 *                     type: string
 *                     example: Test Parent
 *                   email:
 *                     type: string
 *                     example: parent@test.com
 *                   role:
 *                     type: string
 *                     example: parent
 *       500:
 *         description: Server error
 */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // remove password from output
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
