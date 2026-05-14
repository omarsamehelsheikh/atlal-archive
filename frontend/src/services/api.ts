import axios from 'axios';

// Your AWS Public IP Address
const AWS_IP = '44.223.1.165'; // Your new Public IP
const API = axios.create({
  baseURL: `http://${AWS_IP}:5050/api`,
});

/**
 * Refined safeGet to return the expected object structure even on failure.
 */
const safeGet = async (url: string) => {
  try {
    const response = await API.get(url);
    return response;
  } catch (error: any) {
    console.warn(`⚠️ API Error at ${url}:`, error.response?.data || error.message);
    return { data: { success: false, data: [] } }; 
  }
};

export const AdminService = {
  // --- ARTISTS ---
  getAllArtists: () => safeGet('/artists'),
  getArtistById: (id: string) => API.get(`/artists/${id}`),
  upsertArtist: (data: any) => API.post('/artists', data),
  deleteArtist: (id: string) => API.delete(`/artists/${id}`),
  
  // --- ARTWORKS ---
  getAllArtworks: () => safeGet('/artworks'),
  getArtworkById: (id: string) => API.get(`/artworks/${id}`),
  upsertArtwork: (data: any) => API.post('/artworks', data),
  deleteArtwork: (id: string) => API.delete(`/artworks/${id}`),

  // --- SERIES ---
  getAllSeries: () => safeGet('/series'),
  getSeriesById: (id: string) => API.get(`/series/${id}`),
  upsertSeries: (data: any) => API.post('/series', data),
  deleteSeries: (id: string) => API.delete(`/series/${id}`),

  // --- BOOKS ---
  getAllBooks: () => safeGet('/books'),
  getBookById: (id: string) => API.get(`/books/${id}`),
  upsertBook: (data: any) => API.post('/books', data),
  deleteBook: (id: string) => API.delete(`/books/${id}`),

  // --- SECTIONS ---
  getAllSections: () => safeGet('/sections'),
  getSectionById: (id: string) => API.get(`/sections/${id}`),
  upsertSection: (data: any) => API.post('/sections', data),
  deleteSection: (id: string) => API.delete(`/sections/${id}`),

  // --- TAXONOMY (Themes & Tags) ---
  getAllTaxonomy: () => safeGet('/taxonomy/all'), 
  
  /**
   * Fetches single entry for Modifying. 
   */
  getTaxonomyById: (id: string, type: string) => API.get(`/taxonomy/${id}?type=${type}`),

  /**
   * Unified upsert for Themes and Tags.
   */
  upsertTaxonomy: (data: any) => API.post('/taxonomy/upsert', data),
  
  /**
   * Deletes a taxonomy entry.
   */
  deleteTaxonomy: (id: string, type: string) => API.delete(`/taxonomy/${id}?type=${type}`),

  /**
   * BULK IMPORT
   */
  importData: (type: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return API.post(`/import/${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};