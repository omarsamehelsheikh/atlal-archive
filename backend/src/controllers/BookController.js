const BookService = require('../services/BookService');

class BookController {
  async getAll(req, res) {
    try {
      const data = await BookService.getAllBooks();
      res.status(200).json({ success: true, data: data || [] });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }


  async getById(req, res) {
    try {
      const { id } = req.params; // Captures "BOOK01" from the URL
      const data = await BookService.getBookById(id);
      
      if (!data) {
        return res.status(404).json({ success: false, message: "Book not found" });
      }
      
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async createOrUpdate(req, res) {
    try {
      const data = await BookService.updateBook(req.body);
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async delete(req, res) {
    try {
      await BookService.deleteBook(req.params.id);
      res.status(200).json({ success: true, message: "Book deleted" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new BookController();