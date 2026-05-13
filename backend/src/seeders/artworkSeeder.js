const mongoose = require("mongoose");
const Artwork = require("../models/Artwork");
const Artist = require("../models/Artist");
const Book = require("../models/Book");
require('dotenv').config();

const artworks = [
  // ... Paste your massive array from archivedata.js here ...
];

async function seedArtworks() {
    try {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri);
        console.log("✅ Connected to MongoDB. Starting sync...");

        // Optional: Uncomment the line below if you want to clear old data first
        // await Artwork.deleteMany({}); 

        for (let item of artworks) {
            // 1. Find the REAL Artist _id from the database
            const artist = await Artist.findOne({ 
                $or: [
                    { Full_Name: item.Artist_Name }, 
                    { Artist_ID: item.Artist_ID }
                ] 
            });

            // 2. Find the REAL Book _id from the database
            const book = await Book.findOne({ Book_ID: item.Book_ID });

            if (!artist) {
                console.warn(`⚠️ Artist "${item.Artist_Name}" not found. Skipping.`);
                continue;
            }

            // 3. Map the data to your Artwork Schema
            const mappedData = {
                Artwork_ID: item.Artwork_ID,
                artist: artist._id,      // Real DB Link
                book: book ? book._id : null, // Real DB Link
                Artist_Name: item.Artist_Name,
                Title_In_English: item.Title_In_English,
                Title_In_Arabic: item.Title_In_Arabic,
                Year_Created: item.Year_Created,
                Medium: item.Medium,
                Duration: item.Duration,
                Artwork_Description_In_English: item.Artwork_Description_In_English,
                Cloudinary_Images: item.Cloudinary_Images,
                Section_ID: item.Section_ID
            };

            // 4. Upsert (Update if exists, otherwise create)
            await Artwork.findOneAndUpdate(
                { Artwork_ID: item.Artwork_ID }, 
                mappedData, 
                { upsert: true, new: true }
            );
        }

        console.log("🏁 Artworks synced successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
}

seedArtworks();