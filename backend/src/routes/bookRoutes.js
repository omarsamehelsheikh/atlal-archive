const express = require('express');
const router = express.Router();
const BookController = require('../controllers/BookController');

router.get('/', (req, res) => BookController.getAll(req, res));
router.get('/:id', (req, res) => BookController.getById(req, res));
router.post('/', (req, res) => BookController.createOrUpdate(req, res));
router.delete('/:id', (req, res) => BookController.delete(req, res));

module.exports = router;