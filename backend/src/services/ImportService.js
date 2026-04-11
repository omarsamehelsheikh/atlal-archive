const xlsx = require('xlsx');
const ArtistRepo = require('../repositories/ArtistRepo');
const ArtworkRepo = require('../repositories/ArtworkRepo');
const BookRepo = require('../repositories/BookRepo');
const SectionRepo = require('../repositories/SectionRepo');
const SeriesRepo = require('../repositories/SeriesRepo');
// NEW REPOS
const { ThemeRepo, TagRepo } = require('../repositories/TaxonomyRepo');

class ImportService {
  async processImport(buffer, type) {
    // 1. READ EXCEL BUFFER
    const workbook = xlsx.read(buffer, { type: 'buffer' });

    // 2. DYNAMIC TAB SELECTION
    const tabMapping = {
      'artist': 'Artist',
      'artwork': 'Artworks',
      'book': 'Books', 
      'series': 'Series',
      'section': 'Sections',
      'theme': 'Themes', // Matches your "Themes" tab
      'tag': 'Tags'      // Matches your "Tags" tab
    };

    const targetSheet = tabMapping[type] || workbook.SheetNames[0];
    const sheet = workbook.Sheets[targetSheet];

    if (!sheet) {
      throw new Error(`Sheet named "${targetSheet}" not found in the uploaded file.`);
    }

    const rawData = xlsx.utils.sheet_to_json(sheet);
    if (rawData.length === 0) throw new Error(`The sheet "${targetSheet}" is empty.`);

    // 3. UPDATED DATA MAPPERS
    const mappers = {
      artist: {
        'Artist_ID': 'Artist_ID',
        'Full_Name': 'Full_Name',
        'Full_Name_In_Arabic': 'Full_Name_In_Arabic',
        'Student_Responsible': 'Student_Responsible',
        'Full_Name_In_Arabic_In_Tashkeel': 'Full_Name_In_Arabic_In_Tashkeel',
        'Age': 'Age',
        'Gender': 'Gender',
        'Date_Of_Birth': 'Date_Of_Birth',
        'Birth_Year': 'Birth_Year',
        'Nationality': 'Nationality',
        'Birth_Country': 'Birth_Country',
        'Birth_City': 'Birth_City',
        'Birth_City_In_Arabi': 'Birth_City_In_Arabic',
        'Current_Country': 'Current_Country',
        'Current_City': 'Current_City',
        'Bio_In_English': 'Bio_In_English',
        'Bio_In_Arabic': 'Bio_In_Arabic',
        'Cloudinary_Image1': 'Cloudinary_Image1',
        'Undergraduate_Degree': 'Undergraduate_Degree',
        'Postgraduate_Degree': 'Postgraduate_Degree',
        'Email': 'Email',
        'Instagram': 'Instagram',
        'Status': 'Status'
      },
      artwork: {
        'Artwork_ID': 'Artwork_ID',
        'Artist_ID': 'Artist_ID',
        'Artist_Name': 'Artist_Name',
        'Title_In_English': 'Title_In_English',
        'Title_In_Arabic': 'Title_In_Arabic',
        'Series_ID': 'Series_ID',
        'Year_Created': 'Year_Created',
        'Medium': 'Medium',
        'Artwork_Dimensions (cm)': 'Artwork_Dimensions',
        'Duration (video/film)': 'Duration',
        'Artwork_Description_In_English': 'Artwork_Description_In_English',
        'Artwork_Description_In_Arabic': 'Artwork_Description_In_Arabic',
        'Film/Image_URL': 'Film_Image_URL',
        'Cloudinary Image URL': 'Cloudinary_Image_URL',
        'Section_ID': 'Section_ID',
        'Book_ID': 'Book_ID',
        'Status': 'Status',
        // ADDED: Integration for the Junction Tabs
        'Theme_ID': 'Themes', 
        'Tag_ID': 'Tags'
      },
      series: {
        'Series_ID': 'Series_ID',
        'Artist_ID': 'Artist_ID',
        'Series_Title_En': 'Series_Title_En', 
        'Series_Title_Ar': 'Series_Title_Ar',
        'Description_En': 'Description_En',
        'Description_Ar': 'Description_Ar'
      },
      book: {
        'Book ID': 'Book_ID',
        'Book_ID': 'Book_ID',
        'Book_Title': 'Book_Title',
        'Title_In_Arabic': 'Title_In_Arabic',
        'Description': 'Description'
      },
      section: {
        'Section ID': 'Section_ID',
        'Section_ID': 'Section_ID',
        'Book ID': 'Book_ID',
        'Book_ID': 'Book_ID',
        'Section_Title': 'Section_Title',
        'Section_Title_In_Arabic': 'Section_Title_In_Arabic',
        'Section_Order': 'Section_Order'
      },
      theme: {
        'Theme ID': 'Theme_ID',
        'Theme_ID': 'Theme_ID',
        'Theme_Name': 'Theme_Name',
        'Theme_Name_In_Arabic': 'Theme_Name_In_Arabic'
      },
      tag: {
        'Tag ID': 'Tag_ID',
        'Tag_ID': 'Tag_ID',
        'Tag_Name': 'Tag_Name',
        'Tag_Name_In_Arabic': 'Tag_Name_In_Arabic'
      }
    };

    // 4. CLEANING & MAPPING LOGIC
    const cleanedRows = rawData.map(row => {
      const mappedRow = {};
      const currentMapper = mappers[type];

      if (currentMapper) {
        Object.entries(currentMapper).forEach(([excelHeader, dbField]) => {
          if (row[excelHeader] !== undefined) {
            let value = row[excelHeader];

            // UPDATED: Logic to convert comma-strings into Arrays specifically for Artworks
            if (type === 'artwork' && (dbField === 'Themes' || dbField === 'Tags')) {
              mappedRow[dbField] = typeof value === 'string' 
                ? value.split(',').map(item => item.trim()).filter(item => item !== "")
                : [value];
            } else {
              mappedRow[dbField] = value;
            }
          }
        });
      } else {
        Object.keys(row).forEach(key => {
          const standardKey = key.trim().replace(/\s+/g, '_');
          mappedRow[standardKey] = row[key];
        });
      }
      return mappedRow;
    });

    // 5. DATABASE UPSERT LOOP
    let successCount = 0;
    for (const row of cleanedRows) {
      // Pick the primary ID based on the type
      const id = row.Series_ID || 
                 row.Artwork_ID || 
                 row.Artist_ID || 
                 row.Book_ID || 
                 row.Section_ID || 
                 row.Theme_ID || 
                 row.Tag_ID;
      
      if (!id) {
        console.warn(`⚠️ Skipping row in ${type}: Primary ID is missing.`);
        continue;
      }

      try {
        switch (type) {
          case 'artist': 
            await ArtistRepo.upsert(row); 
            break;
          case 'artwork': 
            await ArtworkRepo.artworkUpsert(row); 
            break;
          case 'book': 
            await BookRepo.upsert(row); 
            break;
          case 'series': 
            await SeriesRepo.upsert(row); 
            break;
          case 'section': 
            await SectionRepo.upsert(row); 
            break;
          case 'theme': 
            await ThemeRepo.upsert(row); 
            break;
          case 'tag': 
            await TagRepo.tagUpsert ? await TagRepo.tagUpsert(row) : await TagRepo.upsert(row); 
            break;
        }
        successCount++;
      } catch (err) {
        console.error(`❌ Import Error on ${id}:`, err.message);
      }
    }

    return {
      success: true,
      message: `${type} import successful from tab: ${targetSheet}`,
      count: successCount,
      totalProcessed: cleanedRows.length,
      sheetUsed: targetSheet
    };
  }
}

module.exports = new ImportService();