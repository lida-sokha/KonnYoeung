const express = require('express');
const router = express.Router();

const {
    getAllUser, createUser , deleteUser
} = require('../controllers/admin.controller');

/**
 * @swagger
 * /api/admin/all-users:
 *   get:
 *     summary: Retrieve all registered users
 *     description: Fetches a list of all users from the system. This endpoint typically requires administrator privileges.
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: Successfully retrieved users list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64a1f2c9e8b1a123456789ab"
 *         username:
 *           type: string
 *           example: "admin_user"
 *         email:
 *           type: string
 *           example: "admin@example.com"
 *         role:
 *           type: string
 *           example: "admin"
 */
router.get("/all-users", getAllUser);

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *         - role
 *       properties:
 *         fullName:
 *           type: string
 *           example: "new_admin"
 *         email:
 *           type: string
 *           format: email
 *           example: "new_admin@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "StrongPassword123"
 *         role:
 *           type: string
 *           enum: [admin, parent]
 *           example: "admin"
 *
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64a1f2c9e8b1a123456789ab"
 *         fullName:
 *           type: string
 *           example: "new_admin"
 *         email:
 *           type: string
 *           example: "new_admin@example.com"
 *         role:
 *           type: string
 *           example: "admin"
 */
/**
 * @swagger
 * /api/admin/create-user:
 *   post:
 *     summary: Create a new user (Admin or Parent)
 *     description: Allows an administrator to create a new user account with a specified role such as Admin or Parent.
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing required fields or user already exists
 *       500:
 *         description: Internal server error
 */
router.post("/create-user", createUser);

/**
 * @swagger
 * /api/admin/delete-user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The MongoDB ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       500:
 *         description: Internal server error
 */
router.delete("/delete-user/:id", deleteUser);

module.exports = router;