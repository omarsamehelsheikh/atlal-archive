const express = require('express');
const router = express.Router();
const ArtworkController = require('../controllers/ArtworkController');
const upload = multer(); // Store file in memory buffer

// GET /api/artworks (All pieces)
router.get('/', (req, res) => ArtworkController.getAll(req, res));

// ADDED: GET /api/artworks/:id (Loading data for Modify)
router.get('/:id', (req, res) => ArtworkController.getById(req, res));

// GET /api/artworks/artist/:artistId
router.get('/artist/:artistId', (req, res) => ArtworkController.getByArtist(req, res));

// POST /api/artworks (Manual Create/Update)
router.post('/', (req, res) => ArtworkController.createOrUpdate(req, res));

// DELETE /api/artworks/:id
router.delete('/:id', (req, res) => ArtworkController.delete(req, res));



// This route handles the "Sync Gallery" button from your Frontend
router.post('/import/artwork', upload.single('file'), ArtworkController.importExcel);

module.exports = router;