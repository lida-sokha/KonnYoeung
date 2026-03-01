const express = require('express');
const router = express.Router();

const {
    getAllUser
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

module.exports = router;