const BookRepo = require('../repositories/BookRepo');

class BookService {
  async getAllBooks() {
    return await BookRepo.getAll();
  }

  async getBookById(id) {
    return await BookRepo.findById(id);
  }

  async updateBook(data) {
    return await BookRepo.upsert(data);
  }

  async deleteBook(id) {
    return await BookRepo.delete(id);
  }
}

module.exports = new BookService();