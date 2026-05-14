const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  Artwork_ID: { type: String, required: true, unique: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  Artist_ID_Custom: String,
  Book_ID_Custom: String,
  Artist_Name: String,
  Title_In_English: String,
  Title_In_Arabic: String,
  Series_ID: String,
  Year_Created: String,
  Year_Finished: String,
  Medium: String,
  Artwork_Dimensions: String,
  Duration: String,
  Artwork_Description_In_English: String,
  Artwork_Description_In_Arabic: String,
  Film_Image_URL: String,
  Cloudinary_Images: [String], // Array of strings
  Section_ID: String,
  Section_Title: String,
  Status: { type: String, enum: ['Draft', 'Published', 'Archived', 'Complete'], default: 'Draft' },
  Themes: [{ type: String }],
  Tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Artwork', artworkSchema);