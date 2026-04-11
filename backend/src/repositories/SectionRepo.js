const Section = require('../models/Section');

class SectionRepository {
  async getAll() {
    return await Section.find({}).sort({ Section_Order: 1, Section_ID: 1 }).lean();
  }

  async findById(id) {
    if (!id || id === 'undefined') return null;
    return await Section.findOne({ Section_ID: id }).lean();
  }

  // Added this to support the Service logic
  async findByBook(bookId) {
    return await Section.find({ Book_ID: bookId }).sort({ Section_Order: 1 }).lean();
  }

  async upsert(data) {
    if (!data.Section_ID) throw new Error("Section_ID is required");
    return await Section.findOneAndUpdate(
      { Section_ID: data.Section_ID },
      data,
      { upsert: true, new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await Section.findOneAndDelete({ Section_ID: id });
  }
}

module.exports = new SectionRepository();