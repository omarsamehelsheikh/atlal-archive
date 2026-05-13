const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  // Keep your custom ID for reference
  Artwork_ID: { type: String, required: true, unique: true },
  
  // RELATIONSHIPS: Changed to ObjectId for the handshake to work
 // inside artworkSchema in models/Artwork.js
artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
Artist_ID_Custom: String, // Stores "AR15"
Book_ID_Custom: String  ,  // Stores "BOOK07"

  // DATA FIELDS (Matched to your JSON keys)
 
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
  
  // Image handling
  Film_Image_URL: String,
  // Ensure this matches your seeder key: Cloudinary_Images
  Cloudinary_Images: [String], 
  
  // Categorization
  Section_ID: String,
  Section_Title: String,

  
  Status: { 
    type: String, 
    enum: ['Draft', 'Published', 'Archived'], 
    default: 'Draft' 
  },

  // Supporting arrays
  Themes: [{ type: String }], 
  Tags: [{ type: String }]
  
}, { timestamps: true });

module.exports = mongoose.model('Artwork', artworkSchema);