const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
    },
    title: {
        type: String,     
    },   
    description: {
        type: String,
    },
    tagData:{
        type: Object,
    },
    date: {
        type: Date,
        default :Date.now(),
      },
  
});

module.exports = mongoose.model('Note', NoteSchema);