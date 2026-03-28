const express = require('express');
const router = express.Router();
const { getAllDiseases, getDiseaseById } = require('../controllers/disease.controller');

router.get('/', getAllDiseases);
router.get('/:id', getDiseaseById);

module.exports = router;