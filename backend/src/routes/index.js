const express = require('express');
const router = express.Router();

// Import all your route files
const artistRoutes = require('./artistRoutes');
const artworkRoutes = require('./artworkRoutes');
const bookRoutes = require('./bookRoutes');
const sectionRoutes = require('./sectionRoutes');
const seriesRoutes = require('./seriesRoutes');
const taxonomyRoutes = require('./taxonomyRoutes');
const importRoutes = require('./importRoutes');

// Map them to paths
router.use('/artists', artistRoutes);
router.use('/artworks', artworkRoutes);
router.use('/books', bookRoutes);
router.use('/sections', sectionRoutes);
router.use('/series', seriesRoutes);
router.use('/taxonomy', taxonomyRoutes);
router.use('/import', importRoutes);

module.exports = router;