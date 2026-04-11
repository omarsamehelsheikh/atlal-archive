const TaxonomyService = require('../services/TaxonomyService');

class TaxonomyController {
  async getAll(req, res) {
    try {
      const data = await TaxonomyService.getFullTaxonomy();
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const { type } = req.query; // 'theme' or 'tag'
      const data = await TaxonomyService.getEntryById(id, type);
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async createOrUpdate(req, res) {
    try {
      const { type } = req.body;
      const result = await TaxonomyService.syncTaxonomy(req.body, type);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const { type } = req.query; 
      await TaxonomyService.removeEntry(id, type);
      res.status(200).json({ success: true, message: "Entry removed" });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new TaxonomyController();