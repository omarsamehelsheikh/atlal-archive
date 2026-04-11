const mongoose = require('mongoose');
const ThemeSchema = new mongoose.Schema({
  Theme_ID: { type: String, required: true, unique: true },
  Theme_Name: { type: String, required: true },
  Theme_Name_In_Arabic: String
}, { timestamps: true });
module.exports = mongoose.model('Theme', ThemeSchema);