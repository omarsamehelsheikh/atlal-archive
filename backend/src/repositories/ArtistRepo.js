const Artist = require('../models/Artist');

class ArtistRepository {
  async findAll() {
    return await Artist.find().sort({ Full_Name: 1 });
  }

  async findById(id) {
    return await Artist.findOne({ Artist_ID: id });
  }

  // Uses Artist_ID to update existing records or create new ones
  async upsert(data) {
    const cleanedData = {};

    // --- Data Transformation Logic ---
    Object.keys(data).forEach((key) => {
      // 1. Remove leading/trailing spaces and replace internal spaces with underscores
      let cleanKey = key.trim().replace(/\s+/g, '_');

      // 2. Fix the specific typo from the Excel sheet
      if (cleanKey === "Birth_City_In_Arabi") {
        cleanKey = "Birth_City_In_Arabic";
      }

      // 3. Handle Array conversion (Fields & Artistic Practices)
      // If the Excel cell has "Painting, Sculpture", this turns it into ["Painting", "Sculpture"]
      if ((cleanKey === "Fields" || cleanKey === "Artistic_Practices") && typeof data[key] === 'string') {
        cleanedData[cleanKey] = data[key].split(',').map(item => item.trim()).filter(Boolean);
      } else {
        cleanedData[cleanKey] = data[key];
      }
    });

    // --- Database Operation ---
    return await Artist.findOneAndUpdate(
      { Artist_ID: cleanedData.Artist_ID },
      cleanedData,
      { 
        upsert: true, 
        new: true, 
        runValidators: true,
        setDefaultsOnInsert: true 
      }
    );
  }

  async delete(id) {
    return await Artist.findOneAndDelete({ Artist_ID: id });
  }
}

module.exports = new ArtistRepository();