
const mongoose = require('mongoose');
const TagSchema = new mongoose.Schema({
  Tag_ID: { type: String, required: true, unique: true },
  Tag_Name: { type: String, required: true },
  Tag_Name_In_Arabic: String
}, { timestamps: true });
module.exports = mongoose.model('Tag', TagSchema);