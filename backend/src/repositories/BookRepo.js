const Book = require('../models/Book');

class BookRepository {
  async getAll() {
    return await Book.find({}).sort({ Book_ID: 1 }).lean();
  }

  // FIX: Explicitly find by Book_ID string
  async findById(id) {
    if (!id || id === 'undefined') return null;
    return await Book.findOne({ Book_ID: id }).lean();
  }

  async upsert(data) {
    if (!data.Book_ID) throw new Error("Book_ID is required");
    return await Book.findOneAndUpdate(
      { Book_ID: data.Book_ID },
      data,
      { upsert: true, new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await Book.findOneAndDelete({ Book_ID: id });
  }
}

module.exports = new BookRepository();