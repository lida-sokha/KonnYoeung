const multer = require("multer");
const express = require('express');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Optional: Limit files to 5MB
});
const {
    getAllUser, createUser, deleteUser, createArticle, getallArticle, getArticleById, deleteArticle, updateArticle, getallHospital,
    AddHospital, DeleteHospital, UpdateHospital, getHospitalById, getDashboardStats, getRecentActivities, getActivityChartData
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


/**
 * @swagger
 * /api/admin/create-article:
 *   post:
 *     summary: Create an article and upload images to Cloudinary
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Article title
 *               author:
 *                 type: string
 *                 description: Name of the author
 *               content:
 *                 type: string
 *                 description: JSON string of article blocks
 *               articleImages:
 *                 type: array
 *                 description: Multiple images for the article
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Article created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       500:
 *         description: Internal server error
 */
router.post(
  "/create-article",
  upload.array("articleImages"), 
  createArticle
);

/**
 * @swagger
 * /api/admin/articles:
 *   get:
 *     summary: Retrieve all articles
 *     tags:
 *       - Admin
 *     description: Get a list of all articles from the database, sorted by newest first.
 *     responses:
 *       200:
 *         description: A list of articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *       500:
 *         description: Internal server error
 */
router.get("/articles", getallArticle);

/**
 * @swagger
 * /api/admin/article/{id}:
 *   get:
 *     summary: Get article by ID
 *     description: Retrieve a single article by its ID
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error
 */
router.get("/article/:id", getArticleById);


/**
 * @swagger
 * /api/admin/article/{id}:
 *   delete:
 *     summary: Delete an article by ID
 *     description: Deletes an article using either its MongoDB _id (24-character string) or its numerical article_ID.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The MongoDB _id OR the numerical article_ID
 *         schema:
 *           type: string
 *           example: "64f1234567890abcdef12345"
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error
 */
router.delete("/article/:id", deleteArticle);

/**
 * @swagger
 * /api/admin/article/{id}:
 *   put:
 *     summary: Update an article by ID (Full Edit with Images)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The MongoDB _id or numerical article_ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               article_title:
 *                 type: string
 *               article_author:
 *                 type: string
 *               article_status:
 *                 type: string
 *                 enum:
 *                   - Draft
 *                   - Published
 *               publish_date:
 *                 type: string
 *                 format: date
 *               categories:
 *                 type: string
 *                 description: JSON stringified array of categories
 *               content_blocks:
 *                 type: string
 *                 description: JSON stringified array of content blocks
 *               articleImages:
 *                 type: array
 *                 description: New images to upload
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Updated successfully
 *       400:
 *         description: Invalid input or file format
 *       404:
 *         description: Article not found
 *       500:
 *         description: Server error (Check console for Mongoose validation errors)
 */
router.put("/article/:id", upload.array('articleImages'), updateArticle);

/**
 * @swagger
 * /api/admin/hospitals:
 *   get:
 *     summary: Retrieve all hospitals
 *     tags: 
 *      - Admin
 *     description: Returns a list of all hospitals stored in the MongoDB "Hospitals" collection.
 *     responses:
 *       200:
 *         description: A successful list of hospitals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hospital'
 *       500:
 *         description: Server error
 */
router.get("/hospitals", getallHospital);

/**
 * @swagger
 * /api/admin/hospitals:
 *   post:
 *     summary: Add a new hospital with image
 *     tags: [Admin]
 *     description: Create a new hospital entry and upload an image to Cloudinary.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [Public, Private]
 *               province:
 *                 type: string
 *               address:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               phone_number:
 *                 type: string
 *               is_24h_service:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The hospital image file to upload
 *     responses:
 *       201:
 *         description: Hospital created successfully
 *       400:
 *         description: Validation error or missing file
 *       500:
 *         description: Server error
 */
router.post("/hospitals", upload.single('image'), AddHospital);

/**
 * @swagger
 * /api/admin/hospitals/{id}:
 *   delete:
 *     summary: Delete a hospital
 *     tags: [Admin]
 *     description: Delete a hospital from the database and remove its associated image from Cloudinary.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the hospital to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hospital and associated image deleted successfully
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
 *                   example: Hospital and associated image deleted successfully
 *       404:
 *         description: Hospital not found
 *       500:
 *         description: Server error
 */
router.delete('/hospitals/:id', DeleteHospital);


/**
 * @swagger
 * /api/admin/hospitals/{id}:
 *   put:
 *     summary: Update an existing hospital
 *     tags: [Admin]
 *     description: Update hospital information and optionally upload a new image.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the hospital to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [Public, Private]
 *               province:
 *                 type: string
 *               address:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               phone_number:
 *                 type: string
 *               is_24h_service:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional new hospital image
 *     responses:
 *       200:
 *         description: Hospital updated successfully
 *       404:
 *         description: Hospital not found
 *       500:
 *         description: Server error
 */
router.put('/hospitals/:id', upload.single('image'), UpdateHospital);

/**
 * @swagger
 * /api/admin/hospitals/{id}:
 *   get:
 *     summary: Get a single hospital by ID
 *     tags: [Admin]
 *     description: Retrieve detailed information about a specific hospital for editing or viewing.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the hospital to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hospital details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Hospital'
 *       404:
 *         description: Hospital not found
 *       500:
 *         description: Server error
 */
router.get('/hospitals/:id', getHospitalById);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard statistics counts
 *     tags: [Admin]
 *     description: Retrieve total counts for users, hospitals, diseases, and articles used in the admin dashboard.
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: integer
 *                       example: 120
 *                     hospitals:
 *                       type: integer
 *                       example: 35
 *                     diseases:
 *                       type: integer
 *                       example: 60
 *                     articles:
 *                       type: integer
 *                       example: 80
 *       500:
 *         description: Server error
 */
router.get('/stats', getDashboardStats);

router.get('/Activity', getRecentActivities);

router.get('/activity-chart', getActivityChartData);
module.exports = router;