const express = require('express');
const router = express.Router();
const {
  getAllArticle,
  getArticleById,
} = require('../controllers/article.controller');

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Get all articles
 *     description: Retrieve a list of all available articles
 *     tags:
 *       - Articles
 *     responses:
 *       200:
 *         description: Successfully retrieved list of articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Get article by ID
 *     description: Retrieve a single article by its ID
 *     tags:
 *       - Articles
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
router.get('/:id', getArticleById);

module.exports = router;
