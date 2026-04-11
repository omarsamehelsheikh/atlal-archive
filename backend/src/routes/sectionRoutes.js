const express = require('express');
const router = express.Router();
const SectionController = require('../controllers/SectionController');

router.get('/', (req, res) => SectionController.getAll(req, res));
router.get('/:id', (req, res) => SectionController.getById(req, res));
router.post('/', (req, res) => SectionController.createOrUpdate(req, res));
router.delete('/:id', (req, res) => SectionController.delete(req, res));

module.exports = router;