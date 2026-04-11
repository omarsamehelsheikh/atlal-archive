const express = require('express');
const router = express.Router();
const ArtistController = require('../controllers/ArtistController');

router.get('/', (req, res) => ArtistController.getAll(req, res));
router.get('/:id', (req, res) => ArtistController.getById(req, res));
router.post('/', (req, res) => ArtistController.createOrUpdate(req, res));
router.delete('/:id', (req, res) => ArtistController.delete(req, res));

module.exports = router;