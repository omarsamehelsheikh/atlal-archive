const SeriesService = require('../services/SeriesService');

class SeriesController {
  async getAll(req, res) {
    try {
      const data = await SeriesService.getAllSeries();
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await SeriesService.getSeriesById(id);
      
      // We wrap it in a 'data' key to match your frontend expectations
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(404).json({ success: false, error: "Series not found" });
    }
  }

  async createOrUpdate(req, res) {
    try {
      const data = await SeriesService.upsertSeries(req.body);
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await SeriesService.deleteSeries(req.params.id);
      res.status(200).json({ success: true, message: "Series Purged" });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new SeriesController();