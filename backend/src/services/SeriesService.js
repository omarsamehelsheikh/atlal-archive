const SeriesRepo = require('../repositories/SeriesRepo');
const Series = require('../models/Series'); // Import model for fallback

class SeriesService {
  async getAllSeries() {
    return await SeriesRepo.getAll();
  }

  async getSeriesById(id) {
    // 1. Try finding by custom Series_ID (e.g., S001)
    let series = await SeriesRepo.findById(id);
    
    // 2. Fallback: If not found, try finding by MongoDB Hex _id
    if (!series && id.match(/^[0-9a-fA-F]{24}$/)) {
      series = await Series.findById(id).lean();
    }
    
    if (!series) throw new Error("Series record not found in archive");
    return series;
  }

  async upsertSeries(data) {
    if (!data.Series_ID) throw new Error("Series_ID is required for cataloging");
    return await SeriesRepo.upsert(data);
  }

  async deleteSeries(id) {
    // 1. Try deleting by custom Series_ID
    let result = await SeriesRepo.delete(id);

    // 2. Fallback: Try deleting by MongoDB Hex _id
    if (!result && id.match(/^[0-9a-fA-F]{24}$/)) {
      result = await Series.findByIdAndDelete(id);
    }
    
    return result;
  }
}

module.exports = new SeriesService();