const express = require('express');
const router = express.Router();
const multer = require('multer');
const ImportController = require('../controllers/ImportController');

// Store file in memory for processing
const upload = multer({ storage: multer.memoryStorage() });

/**
 * URL: POST /api/import/:type
 * :type can be 'artist', 'artwork', 'book', 'section', 'theme', or 'tag'
 */
router.post('/:type', upload.single('file'), (req, res) => 
  ImportController.handleExcelUpload(req, res)
);

module.exports = router;