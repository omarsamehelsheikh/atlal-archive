const express = require('express');
const router = express.Router();
const TaxonomyController = require('../controllers/TaxonomyController');

router.get('/all', TaxonomyController.getAll);
router.post('/upsert', TaxonomyController.createOrUpdate);

// THIS IS THE LINE MISSING OR INCORRECT
router.get('/:id', TaxonomyController.getById); 

router.delete('/:id', TaxonomyController.delete);

module.exports = router;