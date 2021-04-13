const mongoose = require('mongoose');

//schema
const JobApplicationSchema = new mongoose.Schema({
  organization: {
    type: String,
    required:true
  },
  date: {
    type: Date,
    required:true
  },
  attachment: {
    type: [],
    required:true
  }
});

module.exports = mongoose.model('JobApplication', JobApplicationSchema);
