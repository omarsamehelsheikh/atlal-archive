const xlsx = require('xlsx');
const Artwork = require('../models/Artwork');
const Artist = require('../models/Artist');
const Book = require('../models/Book');
const ArtworkService = require('../services/ArtworkService');

class ArtworkController {
    async importExcel(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: "No file uploaded" });
            }

            const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = xlsx.utils.sheet_to_json(sheet);

            const groupedData = new Map();

            rows.forEach(row => {
                // Smart ID Check
                const id = row.ArtworkID || row.Artwork_ID || row.artwork_id;
                if (!id) return;

                if (!groupedData.has(id)) {
                    groupedData.set(id, {
                        Artwork_ID: id,
                        Artist_ID_Custom: row.Artist_ID || row.ArtistID || row.artist_id,
                        Book_ID_Custom: row.Book_ID || row.BookID || row.book_id,
                        Artist_Name: row.Artist_Name,
                        Title_In_English: row.Title_In_English,
                        Title_In_Arabic: row.Title_In_Arabic,
                        Series_ID: row.Series_ID,
                        Year_Created: String(row.Year_Created || ''),
                        Year_Finished: String(row.Year_Finished || ''),
                        Medium: row.Medium,
                        Artwork_Dimensions: row['Artwork_Dimensions (cm)'] || row.Artwork_Dimensions,
                        Duration: row['Duration (video/film)'] || row.Duration,
                        Artwork_Description_In_English: row.Artwork_Description_In_English === '#VALUE!' ? '' : row.Artwork_Description_In_English,
                        Artwork_Description_In_Arabic: row.Artwork_Description_In_Arabic,
                        Film_Image_URL: row['Film/Image_URL'] || row.Film_Image_URL,
                        Section_ID: row.Section_ID,
                        Status: row.Status || 'Draft',
                        Cloudinary_Images: [] // Initialized correctly
                    });
                }

                // Smart Image Check
                const cloudUrl = row['Cloudinary Image URL'] || row.Cloudinary_Image_URL || row.cloudinary_url;
                if (cloudUrl && cloudUrl !== 'N/A' && !groupedData.get(id).Cloudinary_Images.includes(cloudUrl)) {
                    groupedData.get(id).Cloudinary_Images.push(cloudUrl);
                }
            });

            let count = 0;
            for (const [artworkId, data] of groupedData) {
                const artistDoc = await Artist.findOne({ Artist_ID: data.Artist_ID_Custom });
                if (artistDoc) data.artist = artistDoc._id;

                if (data.Book_ID_Custom) {
                    const bookDoc = await Book.findOne({ Book_ID: data.Book_ID_Custom });
                    if (bookDoc) data.book = bookDoc._id;
                }

                await Artwork.findOneAndUpdate(
                    { Artwork_ID: artworkId },
                    { $set: data },
                    { upsert: true, new: true }
                );
                count++;
            }

            res.status(200).json({ success: true, message: `Successfully synced ${count} artworks.`, data: count });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    async getAll(req, res) {
        try {
            const artworks = await Artwork.find().populate('artist').populate('book');
            res.status(200).json({ success: true, data: artworks });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    async getById(req, res) {
        try {
            const artwork = await ArtworkService.getArtworkById(req.params.id);
            if (!artwork) return res.status(404).json({ success: false, message: "Artwork not found" });
            res.status(200).json({ success: true, data: artwork });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    async createOrUpdate(req, res) {
        try {
            const artwork = await ArtworkService.updateArtwork(req.body.Artwork_ID, req.body);
            res.status(201).json({ success: true, data: artwork });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }

    async delete(req, res) {
        try {
            await ArtworkService.deleteArtwork(req.params.id);
            res.status(200).json({ success: true, message: "Artwork deleted successfully" });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}

module.exports = new ArtworkController();