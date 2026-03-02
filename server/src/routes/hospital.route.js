const express = require('express');
const router = express.Router();
const {
  getAllHospital,
  addHospital,
  getHospitalById
} = require('../controllers/hospital.controller');

/**
 * @swagger
 * tags:
 *   - name: Hospitals
 *     description: Hospital management API
 */

/**
 * @swagger
 * /api/hospitals:
 *   get:
 *     summary: Retrieve a list of all hospitals
 *     tags: [Hospitals]
 *     responses:
 *       200:
 *         description: A list of hospitals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hospital'
 */
router.get("/", getAllHospital);

/**
 * @swagger
 * /api/hospitals:
 *   post:
 *     summary: Add a new hospital
 *     tags: [Hospitals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HospitalInput'
 *     responses:
 *       201:
 *         description: Hospital created successfully
 */
router.post('/addNewHospital', addHospital);

router.get("/:id", getHospitalById);

module.exports = router;
