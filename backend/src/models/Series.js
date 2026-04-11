const mongoose = require('mongoose');
const SeriesSchema = new mongoose.Schema({
  Series_ID: String,
  Artist_ID: String,
  Series_Title_En: String,
  Series_Title_Ar: String,
  Description_En: String,
  Description_Ar: String
});

// MUST be this:
module.exports = mongoose.model('Series', SeriesSchema);