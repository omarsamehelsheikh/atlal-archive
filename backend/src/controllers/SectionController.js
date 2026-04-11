const SectionService = require('../services/SectionService');

class SectionController {
  async getAll(req, res) {
    try {
      const sections = await SectionService.getAllSections();
      res.status(200).json({ success: true, data: sections });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const section = await SectionService.getSectionById(req.params.id);
      res.status(200).json({ success: true, data: section });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async createOrUpdate(req, res) {
    try {
      const section = await SectionService.syncSection(req.body);
      res.status(201).json({ success: true, data: section });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await SectionService.removeSection(req.params.id);
      res.status(200).json({ success: true, message: "Section deleted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new SectionController();