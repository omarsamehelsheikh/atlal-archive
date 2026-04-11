const Artwork = require('../models/Artwork');

class ArtworkService {
  async getAllArtworks() {
    try {
      return await Artwork.find({}).sort({ createdAt: -1 }); 
    } catch (error) {
      throw new Error('Could not fetch artworks: ' + error.message);
    }
  }

  // ADDED: Required for the "Modify" form to load data
  async getArtworkById(id) {
    return await Artwork.findOne({ Artwork_ID: id });
  }

  async getArtworksForArtist(artistId) {
    return await Artwork.find({ Artist_ID: artistId });
  }

  async updateArtwork(id, data) {
    return await Artwork.findOneAndUpdate({ Artwork_ID: id }, data, { upsert: true, new: true });
  }

  // ADDED: Required for the delete button to work
  async deleteArtwork(id) {
    return await Artwork.findOneAndDelete({ Artwork_ID: id });
  }
}

module.exports = new ArtworkService();