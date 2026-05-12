const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  Artwork_ID: { type: String, required: true, unique: true },
  Student: String,
  Artist_ID: { type: String, required: true },
  Artist_Name: String,
  Title_In_English: String,
  Title_In_Arabic: String,
  Internal_Place_Holder_Title: String,
  Series_ID: String,
  Year_Created: String,
  Year_Finished: String,
  Medium: String,
  Artwork_Dimensions: String,
  Duration: String,
  Artwork_Description_In_English: String,
  Artwork_Description_In_Arabic: String,
  Film_Image_Description_In_English: String,
  Film_Image_Description_In_Arabic: String,
  Film_Image_Resolution: String,
  Film_Image_URL: String,
  Film_Image_Source: String,
  Cloudinary_Image_URLs: [String],
  Section_ID: String,
  Section_Title: String,
  Book_ID: String,
  Status: { type: String, default: 'Draft' },
  // NEW FIELDS: Supporting arrays of IDs
  Themes: [String], 
  Tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Artwork', artworkSchema);