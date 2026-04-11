const Artwork = require('../models/Artwork');

class ArtworkRepository {
  /**
   * Fetches all artworks for the gallery list
   */
  async getAllArtworks() {
    try {
      // Using .lean() for better performance as we discussed for other repos
      return await Artwork.find({}).sort({ createdAt: -1 }).lean();
    } catch (error) {
      throw new Error('Database Error: Could not fetch artworks');
    }
  }

  /**
   * Used by the "Modify" form to load existing data
   */
  async findById(id) {
    return await Artwork.findOne({ Artwork_ID: id }).lean();
  }

  /**
   * Fetches pieces for a specific artist profile
   */
  async findByArtist(artistId) {
    return await Artwork.find({ Artist_ID: artistId }).lean();
  }

  /**
   * CRITICAL FIX: The ImportService calls "artworkUpsert".
   * This logic matches on Artwork_ID and updates or creates the record.
   * Updated to explicitly handle Themes and Tags arrays from the mapper.
   */
  async artworkUpsert(data) {
    if (!data.Artwork_ID) {
      console.warn("⚠️ Skipping row: Artwork_ID is missing.");
      return null;
    }

    try {
      // We use $set to ensure Themes and Tags (Arrays) are overwritten 
      // correctly during Excel synchronization.
      return await Artwork.findOneAndUpdate(
        { Artwork_ID: data.Artwork_ID },
        { $set: data }, 
        { 
          upsert: true, 
          new: true, 
          runValidators: true,
          setDefaultsOnInsert: true 
        }
      );
    } catch (error) {
      console.error(`❌ Repository Error for ${data.Artwork_ID}:`, error.message);
      throw new Error(`Upsert failed for ${data.Artwork_ID}: ${error.message}`);
    }
  }

  /**
   * Permanent deletion from archive
   */
  async deleteArtwork(id) {
    return await Artwork.findOneAndDelete({ Artwork_ID: id });
  }
}

module.exports = new ArtworkRepository();