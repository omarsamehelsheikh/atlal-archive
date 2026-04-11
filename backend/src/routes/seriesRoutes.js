const express = require('express');
const router = express.Router();
const SeriesController = require('../controllers/SeriesController');

// GET /api/series/S001 -> Loads data for Modify
router.get('/:id', (req, res) => SeriesController.getById(req, res));

// DELETE /api/series/S001 -> Deletes the series
router.delete('/:id', (req, res) => SeriesController.delete(req, res));

// GET /api/series -> Loads the list
router.get('/', (req, res) => SeriesController.getAll(req, res));

// POST /api/series -> Upsert logic
router.post('/', (req, res) => SeriesController.createOrUpdate(req, res));

module.exports = router;