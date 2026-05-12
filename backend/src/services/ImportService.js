const xlsx = require('xlsx');
const ArtistRepo = require('../repositories/ArtistRepo');
const ArtworkRepo = require('../repositories/ArtworkRepo');
const BookRepo = require('../repositories/BookRepo');
const SectionRepo = require('../repositories/SectionRepo');
const SeriesRepo = require('../repositories/SeriesRepo');
const { ThemeRepo, TagRepo } = require('../repositories/TaxonomyRepo');
const mongoose = require('mongoose'); // Added to support model access inside switch

// ---------------------------------------------------------------------------
// HELPER: Extract a Google-Sheets IFERROR formula's cached string value.
//
// When the workbook is exported from Google Sheets, translated cells look like:
//   =IFERROR(__xludf.DUMMYFUNCTION("GOOGLETRANSLATE(...)"), "النص العربي")
//
// xlsx.read() returns the raw formula string instead of the computed value.
// This helper pulls out the last quoted argument — the cached Arabic (or any)
// translation — so it is stored cleanly in the DB.
// ---------------------------------------------------------------------------
function resolveFormulaValue(value) {
  if (typeof value !== 'string') return value;
  if (!value.startsWith('=IFERROR(__xludf.DUMMYFUNCTION')) return value;

  // Extract the last quoted string argument from the IFERROR call.
  // The formula ends with: ...), "cached value")
  // We want everything inside the last pair of double-quotes before the final )
  const match = value.match(/,"([^"]*)"\s*\)\s*$/);
  if (match) return match[1];

  // Fallback: the cached value may be empty or malformed — return null
  return null;
}

// ---------------------------------------------------------------------------
// HELPER: Build a lookup map from a junction sheet (e.g. Artwork_Themes).
//
// Each row has: Artwork_ID | comma-separated IDs | formula-label column
// Returns: { 'AW000001': ['THEME005', 'THEME006', ...], ... }
// ---------------------------------------------------------------------------
function buildJunctionMap(workbook, sheetName, artworkIdCol, idCol) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    console.warn(`⚠️  Junction sheet "${sheetName}" not found — skipping.`);
    return {};
  }

  // raw: false makes xlsx return the cached formula result string
  const rows = xlsx.utils.sheet_to_json(sheet, { raw: false, defval: null });
  const map = {};

  for (const row of rows) {
    const artworkId = row[artworkIdCol];
    const rawIds    = row[idCol];

    if (!artworkId || !rawIds) continue;

    // IDs are stored as "THEME005, THEME006, THEME014" — split and trim
    const ids = String(rawIds)
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (ids.length > 0) {
      map[artworkId] = ids;
    }
  }

  return map;
}

// ---------------------------------------------------------------------------
// HELPER: Apply the column mapper to a single raw row, resolving formulas.
// ---------------------------------------------------------------------------
function applyMapper(row, mapper) {
  const mappedRow = {};
  Object.entries(mapper).forEach(([excelHeader, dbField]) => {
    if (row[excelHeader] !== undefined) {
      mappedRow[dbField] = resolveFormulaValue(row[excelHeader]);
    }
  });
  return mappedRow;
}

// ---------------------------------------------------------------------------
// MAIN SERVICE
// ---------------------------------------------------------------------------
class ImportService {
  async processImport(buffer, type) {

    // ── 1. READ WORKBOOK ──────────────────────────────────────────────────
    // cellFormula: false  →  do not store formula objects; fall back to cached value
    // cellNF: false       →  skip number-format metadata (not needed)
    const workbook = xlsx.read(buffer, {
      type: 'buffer',
      cellFormula: false,
      cellNF: false,
    });

    // ── 2. SELECT TARGET SHEET ────────────────────────────────────────────
    const tabMapping = {
      artist:  'Artist',
      artwork: 'Artworks',
      book:    'Books',
      series:  'Series',
      section: 'Sections',
      theme:   'Themes',
      tag:     'Tags',
    };

    const targetSheet = tabMapping[type] || workbook.SheetNames[0];
    const sheet = workbook.Sheets[targetSheet];

    if (!sheet) {
      throw new Error(`Sheet named "${targetSheet}" not found in the uploaded file.`);
    }

    // raw: false  →  returns the cached string for formula cells instead of the formula
    // defval: null →  missing cells come back as null instead of undefined
    const rawData = xlsx.utils.sheet_to_json(sheet, { raw: false, defval: null });
    if (rawData.length === 0) throw new Error(`The sheet "${targetSheet}" is empty.`);

    // ── 3. PRE-BUILD JUNCTION MAPS (needed for artworks only) ─────────────
    // Themes and Tags live in dedicated junction sheets (Artwork_Themes /
    // Artwork_Tags), NOT as columns inside the Artworks sheet.  We build
    // lookup maps keyed by Artwork_ID before processing artwork rows.
    let themeMap = {};
    let tagMap   = {};
    if (type === 'artwork') {
      themeMap = buildJunctionMap(workbook, 'Artwork_Themes', 'Artwork_ID', 'Theme_ID');
      tagMap   = buildJunctionMap(workbook, 'Artwork_Tags',   'Artwork_ID', 'Tag_ID');
    }

    // ── 4. COLUMN MAPPERS ─────────────────────────────────────────────────
    // Keys   = exact Excel header strings (copy-pasted from the sheet).
    // Values = DB field names your repos expect.
    //
    // SERIES NOTE: The Series_ID column has no header in the spreadsheet, so
    // xlsx names it "__EMPTY" automatically. We map that to Series_ID.
    const mappers = {

      artist: {
        'Artist_ID':                        'Artist_ID',
        'Full_Name':                        'Full_Name',
        'Full_Name_In_Arabic':              'Full_Name_In_Arabic',
        'Student_Responsible':              'Student_Responsible',
        'Full_Name_In_Arabic_In_Tashkeel':  'Full_Name_In_Arabic_In_Tashkeel',
        'Age':                              'Age',
        'Diasporic_Vector':                 'Diasporic_Vector',
        'Gender':                           'Gender',
        'Date_Of_Birth':                    'Date_Of_Birth',
        'Birth_Year':                       'Birth_Year',
        'Decease_Date':                     'Decease_Date',
        'Nationality':                      'Nationality',
        'Nationality_In_Arabic':            'Nationality_In_Arabic',
        'Birth_Country':                    'Birth_Country',
        'Birth_Country_In_Arabic':          'Birth_Country_In_Arabic',
        'Birth_City':                       'Birth_City',
        'Birth_City_In_Arabic':             'Birth_City_In_Arabic',
        'Current_Country':                  'Current_Country',
        'Current_Country_In_Arabic':        'Current_Country_In_Arabic',
        'Current_City':                     'Current_City',
        'Current_City_In_Arabic':           'Current_City_In_Arabic',
        'Bio_In_English':                   'Bio_In_English',
        'Bio_In_Arabic':                    'Bio_In_Arabic',
        'Cloudinary_Image1':                'Cloudinary_Image1',
        'Cloudinary_Image2':                'Cloudinary_Image2',
        'Undergraduate_Degree':             'Undergraduate_Degree',
        'Undergraduate_Degree_In_Arabic':   'Undergraduate_Degree_In_Arabic',
        'Postgraduate_Degree':              'Postgraduate_Degree',
        'Postgraduate_Degree_In_Arabic':    'Postgraduate_Degree_In_Arabic',
        'Other_Certificates':               'Other_Certificates',
        'Other_Certificates_In_Arabic':     'Other_Certificates_In_Arabic',
        'Fields':                           'Fields',
        'Artistic Practices':               'Artistic_Practices',
        'Email':                            'Email',
        'Website':                          'Website',
        'Instagram':                        'Instagram',
        'Book_ID':                          'Book_ID',
        'Status':                           'Status',
      },

      artwork: {
        'Artwork_ID':                          'Artwork_ID',
        'Artist_ID':                           'Artist_ID',
        'Artist_Name':                         'Artist_Name',
        'Title_In_English':                    'Title_In_English',
        'Title_In_Arabic':                     'Title_In_Arabic',
        'Series_ID':                           'Series_ID',
        'Year_Created':                        'Year_Created',
        'Year_Finished':                       'Year_Finished',
        'Medium':                              'Medium',
        'Artwork_Dimensions (cm)':             'Artwork_Dimensions',
        'Duration (video/film)':               'Duration',
        'Artwork_Description_In_English':      'Artwork_Description_In_English',
        'Artwork_Description_In_Arabic':       'Artwork_Description_In_Arabic',
        'Film/Image_URL':                      'Film_Image_URL',
        'Cloudinary Image URL':                'Cloudinary_Image_URL',
        'Section_ID':                          'Section_ID',
        'Book_ID':                             'Book_ID',
        'Status':                              'Status',
        // NOTE: Theme_ID and Tag_ID are intentionally NOT mapped here.
        // They come from the junction sheets (see step 3 above).
      },

      // FIXED: Series_ID column has no header → xlsx calls it "__EMPTY"
      // FIXED: column names are Series_Name / Series_Name_In_Arabic (not Series_Title_*)
      series: {
        '__EMPTY':                    'Series_ID',
        'Artist_ID':                  'Artist_ID',
        'Series_Name':                'Series_Title_En',
        'Series_Name_In_Arabic':      'Series_Title_Ar',
        'Series_Description ':        'Description_En',   // note trailing space in sheet
        'Series_Description_In_Arabic': 'Description_Ar',
      },

      book: {
        'Book_ID':          'Book_ID',
        'Book_Title':       'Book_Title',
        'Title_In_Arabic':  'Title_In_Arabic',
        'Description':      'Description',
      },

      section: {
        'Section_ID':               'Section_ID',
        'Book_ID':                  'Book_ID',
        'Section_Title':            'Section_Title',
        'Section_Title_In_Arabic':  'Section_Title_In_Arabic',
        'Section_Order':            'Section_Order',
      },

      theme: {
        'Theme_ID':               'Theme_ID',
        'Theme_Name':             'Theme_Name',
        'Theme_Name_In_Arabic':   'Theme_Name_In_Arabic',
      },

      tag: {
        'Tag_ID':             'Tag_ID',
        'Tag_Name':           'Tag_Name',
        'Tag_Name_In_Arabic': 'Tag_Name_In_Arabic',
      },
    };

    // ── 5. CLEAN & MAP ROWS ───────────────────────────────────────────────
    const cleanedRows = rawData.map(row => {
      const mappedRow = applyMapper(row, mappers[type] || {});

      // Attach Themes and Tags arrays from the junction maps
      if (type === 'artwork') {
        const artworkId = row['Artwork_ID'];
        mappedRow.Themes = themeMap[artworkId] || [];
        mappedRow.Tags   = tagMap[artworkId]   || [];
      }

      return mappedRow;
    });

    // ── 6. UPSERT LOOP ────────────────────────────────────────────────────
    let successCount = 0;
    let skipCount    = 0;

    for (const row of cleanedRows) {
      const id =
        row.Artist_ID  ||
        row.Artwork_ID ||
        row.Series_ID  ||
        row.Book_ID    ||
        row.Section_ID ||
        row.Theme_ID   ||
        row.Tag_ID;

      if (!id) {
        console.warn(`⚠️  Skipping row in "${type}": primary ID is missing.`);
        skipCount++;
        continue;
      }

      try {
        switch (type) {
          case 'artist':  await ArtistRepo.upsert(row);                                               break;
          case 'artwork': 
            // --- UPDATED SCRIPT LOGIC FOR MULTIPLE CLOUDINARY LINKS ---
            const existingArtwork = await mongoose.model('Artwork').findOne({ Artwork_ID: row.Artwork_ID });
            if (existingArtwork) {
              // If it exists, we just add the new URL to the array
              if (row.Cloudinary_Image_URL) {
                await mongoose.model('Artwork').updateOne(
                  { Artwork_ID: row.Artwork_ID },
                  { $addToSet: { Cloudinary_Image_URLs: row.Cloudinary_Image_URL } }
                );
              }
            } else {
              // If new, initialize the array with the URL from the row
              row.Cloudinary_Image_URLs = row.Cloudinary_Image_URL ? [row.Cloudinary_Image_URL] : [];
              delete row.Cloudinary_Image_URL; // Remove the single string field mapping
              await ArtworkRepo.artworkUpsert(row);
            }
            break;
          case 'book':    await BookRepo.upsert(row);                                                 break;
          case 'series':  await SeriesRepo.upsert(row);                                               break;
          case 'section': await SectionRepo.upsert(row);                                              break;
          case 'theme':   await ThemeRepo.upsert(row);                                                break;
          case 'tag':     await (TagRepo.tagUpsert ? TagRepo.tagUpsert(row) : TagRepo.upsert(row));   break;
          default: throw new Error(`Unknown import type: "${type}"`);
        }
        successCount++;
      } catch (err) {
        console.error(`❌ Import error on ${type} "${id}":`, err.message);
      }
    }

    return {
      success:        true,
      message:        `${type} import complete from sheet: ${targetSheet}`,
      count:          successCount,
      skipped:        skipCount,
      totalProcessed: cleanedRows.length,
      sheetUsed:      targetSheet,
    };
  }
}

module.exports = new ImportService();