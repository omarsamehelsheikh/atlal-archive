const ArtistService = require('../services/ArtistService');

class ArtistController {
  async getAll(req, res) {
    try {
      const artists = await ArtistService.getAllArtists();
      res.status(200).json({ success: true, data: artists });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getById(req, res) {
    try {
      const artist = await ArtistService.getArtistById(req.params.id);
      
      // If no artist found, send 404 instead of letting it crash later
      if (!artist) {
        return res.status(404).json({ success: false, message: "Artist not found in archive" });
      }

      res.status(200).json({ success: true, data: artist });
    } catch (err) {
      // This is where the 500 was coming from
      res.status(500).json({ success: false, message: "Internal Server Error: " + err.message });
    }
  }

  async createOrUpdate(req, res) {
    try {
      const artist = await ArtistService.upsertArtist(req.body);
      res.status(200).json({ success: true, data: artist });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await ArtistService.deleteArtist(req.params.id);
      if (!result) return res.status(404).json({ message: "Artist not found" });
      res.status(200).json({ success: true, message: "Record expunged" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new ArtistController();