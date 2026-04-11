const Theme = require('../models/Theme');
const Tag = require('../models/Tag');

class ThemeRepository {
  async getAll() { return await Theme.find({}).sort({ Theme_ID: 1 }).lean(); }
  // Ensure this exists
  async findById(id) { return await Theme.findById(id).lean(); }
  async upsert(data) {
    return await Theme.findOneAndUpdate({ Theme_ID: data.Theme_ID }, data, { upsert: true, new: true });
  }
  async delete(id) { return await Theme.findByIdAndDelete(id); }
}

class TagRepository {
  async getAll() { return await Tag.find({}).sort({ Tag_ID: 1 }).lean(); }
  // Ensure this exists
  async findById(id) { return await Tag.findById(id).lean(); }
  async upsert(data) {
    return await Tag.findOneAndUpdate({ Tag_ID: data.Tag_ID }, data, { upsert: true, new: true });
  }
  async delete(id) { return await Tag.findByIdAndDelete(id); }
}

module.exports = {
  ThemeRepo: new ThemeRepository(),
  TagRepo: new TagRepository()
};