// src/controllers/ImportController.js
const ImportService = require('../services/ImportService');

class ImportController {
  async handleExcelUpload(req, res) {
    try {
      const { type } = req.params;
      if (!req.file) return res.status(400).json({ message: "No file uploaded." });

      const result = await ImportService.processImport(req.file.buffer, type);
      res.status(200).json({
        message: `${type} data imported successfully!`,
        count: result.count
      });
    } catch (err) {
      res.status(500).json({ message: "Import failed", error: err.message });
    }
  }
}
module.exports = new ImportController();