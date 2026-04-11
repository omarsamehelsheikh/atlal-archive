const Series = require('../models/Series');

class SeriesRepository {
  async getAll() {
    return await Series.find({}).sort({ Series_ID: 1 }).lean();
  }

  // Find by the custom Series_ID (e.g., S001)
  async findById(id) {
    return await Series.findOne({ Series_ID: id }).lean();
  }

  async upsert(data) {
    return await Series.findOneAndUpdate(
      { Series_ID: data.Series_ID },
      data,
      { upsert: true, new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await Series.findOneAndDelete({ Series_ID: id });
  }
}

module.exports = new SeriesRepository();