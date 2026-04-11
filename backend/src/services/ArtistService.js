const Artist = require('../models/Artist');

class ArtistService {
  async getAllArtists() {
    return await Artist.find().sort({ createdAt: -1 });
  }

  async getArtistById(id) {
    // CRITICAL FIX: Search by your custom Artist_ID string
    try {
      return await Artist.findOne({ Artist_ID: id });
    } catch (error) {
      throw new Error("Database search failed: " + error.message);
    }
  }

  async upsertArtist(data) {
    if (!data.Artist_ID) throw new Error("Artist_ID is required");
    
    return await Artist.findOneAndUpdate(
      { Artist_ID: data.Artist_ID },
      data,
      { upsert: true, new: true, runValidators: true }
    );
  }

  async deleteArtist(id) {
    return await Artist.findOneAndDelete({ Artist_ID: id });
  }
}

module.exports = new ArtistService();