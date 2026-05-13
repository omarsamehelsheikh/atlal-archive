const xlsx = require('xlsx');
const mongoose = require('mongoose');
const Artwork = require('./models/Artwork'); 
const Artist = require('./models/Artist');   
const Book = require('./models/Book');       

const MONGO_URI = "mongodb+srv://omarsameh2003:omarsameh2003@artworkscluster.dqicys1.mongodb.net/AtlalArchive?retryWrites=true&w=majority&appName=artworksCluster";

async function syncExcelToDb() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🟢 Connected to AtlalArchive Database");

    // 1. Load the Excel file
    const workbook = xlsx.readFile('artworks.xlsx'); // Ensure filename matches
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    // 2. Group images by Artwork_ID
    const groupedData = new Map();

    rows.forEach(row => {
      const id = row.ArtworkID;
      if (!id) return;

      if (!groupedData.has(id)) {
        groupedData.set(id, {
          Artwork_ID: id,
          Artist_ID_Custom: row.Artist_ID,
          Artist_Name: row.Artist_Name,
          Title_In_English: row.Title_In_English,
          Title_In_Arabic: row.Title_In_Arabic,
          Series_ID: row.Series_ID,
          Year_Created: String(row.Year_Created || ''),
          Year_Finished: String(row.Year_Finished || ''),
          Medium: row.Medium,
          Artwork_Dimensions: row['Artwork_Dimensions (cm)'],
          Duration: row['Duration (video/film)'],
          Artwork_Description_In_English: row.Artwork_Description_In_English === '#VALUE!' ? '' : row.Artwork_Description_In_English,
          Artwork_Description_In_Arabic: row.Artwork_Description_In_Arabic,
          Film_Image_URL: row['Film/Image_URL'],
          Cloudinary_Images: [], // We will push all found URLs here
          Section_ID: row.Section_ID,
          Section_Title: row.Section_Title,
          Book_ID_Custom: row.Book_ID,
          Status: row.Status || 'Draft'
        });
      }

      // Add Cloudinary URL to the array if it exists and isn't a placeholder
      const cloudUrl = row['Cloudinary Image URL'];
      if (cloudUrl && cloudUrl !== 'N/A' && !groupedData.get(id).Cloudinary_Images.includes(cloudUrl)) {
        groupedData.get(id).Cloudinary_Images.push(cloudUrl);
      }
    });

    console.log(`📦 Found ${groupedData.size} unique artworks. Starting sync...`);

    // 3. Process and Save
    for (const [artworkId, data] of groupedData) {
      // Find Artist ObjectId via the Custom ID (e.g., AR15)
      const artistDoc = await Artist.findOne({ Artist_ID: data.Artist_ID_Custom });
      if (artistDoc) {
        data.artist = artistDoc._id;
      } else {
        console.warn(`⚠️ Artist ${data.Artist_ID_Custom} not found. Skipping ${artworkId}.`);
        continue; 
      }

      // Find Book ObjectId via the Custom ID (e.g., BOOK07)
      if (data.Book_ID_Custom) {
        const bookDoc = await Book.findOne({ Book_ID: data.Book_ID_Custom });
        if (bookDoc) data.book = bookDoc._id;
      }

      // Upsert: Update if exists, Create if not
      await Artwork.findOneAndUpdate(
        { Artwork_ID: artworkId },
        { $set: data },
        { upsert: true, new: true, runValidators: true }
      );
      
      console.log(`✅ Synced: ${artworkId} | Images: ${data.Cloudinary_Images.length}`);
    }

    console.log("✨ 100% Efficiency Sync Complete.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Sync Failed:", error.message);
    process.exit(1);
  }
}

syncExcelToDb();