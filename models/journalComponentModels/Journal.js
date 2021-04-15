const mongoose = require('mongoose');

//schema
const JournalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  journal: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
  },
});

module.exports = mongoose.model('Journal', JournalSchema);