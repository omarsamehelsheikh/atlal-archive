const ArtworkService = require('../services/ArtworkService');

class ArtworkController {
  // GET /api/artworks
  async getAll(req, res) {
    try {
      const artworks = await ArtworkService.getAllArtworks();
      // Logic: Consistent wrapper so Frontend can use res.data.data
      res.status(200).json({ 
        success: true, 
        data: artworks 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  }

  // GET /api/artworks/:id
  async getById(req, res) {
    try {
      const artwork = await ArtworkService.getArtworkById(req.params.id);
      if (!artwork) {
        return res.status(404).json({ success: false, message: "Artwork not found" });
      }
      res.status(200).json({ 
        success: true, 
        data: artwork 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  }

  // GET /api/artworks/artist/:artistId
  async getByArtist(req, res) {
    try {
      const artworks = await ArtworkService.getArtworksForArtist(req.params.artistId);
      res.status(200).json({ 
        success: true, 
        data: artworks 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  }

  // POST /api/artworks (Manual Create or Update)
  async createOrUpdate(req, res) {
    try {
      // Ensure Artwork_ID is present for the upsert logic
      const artwork = await ArtworkService.updateArtwork(req.body.Artwork_ID, req.body);
      res.status(201).json({ 
        success: true, 
        data: artwork 
      });
    } catch (err) {
      res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
  }

  // DELETE /api/artworks/:id
  async delete(req, res) {
    try {
      await ArtworkService.deleteArtwork(req.params.id);
      res.status(200).json({ 
        success: true, 
        message: "Artwork deleted successfully" 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
}

module.exports = new ArtworkController();