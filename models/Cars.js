const mongoose = require('mongoose');

//schema
const CarSchema = new mongoose.Schema({
  make: {
    type: String,
    required:true
  },
  model: {
    type: String,
    required:true
  },
  year: {
    type: String,
  }
});

module.exports = mongoose.model('Car', CarSchema);
