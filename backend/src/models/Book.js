const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  Book_ID: { type: String, required: true, unique: true },
  Book_Title: String,
  Title_In_Arabic: String,
  Description: String,
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);