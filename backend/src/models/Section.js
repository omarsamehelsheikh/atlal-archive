const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  Section_ID: { type: String, required: true, unique: true },
  Book_ID: String, // Links to the Books module
  Section_Title: String,
  Section_Title_In_Arabic: String,
  Section_Order: Number,
}, { timestamps: true });

module.exports = mongoose.model('Section', SectionSchema);