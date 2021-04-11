const mongoose = require('mongoose');

//schema
const ResumeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  linkedin: {
    type: String,
  },
  github: {
    type: String,
  },
  skills: {
    type: String,
    required: true,
  },
  experience:[
    {
      organization:{
        type:String,
        required: true
      },
      position:{
        type:String,
        required: true
      },
      description:{
        type:String,
        required: true
      },
      duration:{
        type:String,
        required: true
      }
    }
  ],
  project:[
    {
      title:{
        type:String,
        required: true
      },
      link:{
        type:String,
      
      },
      description:{
        type:String,
        required: true
      }
    }
  ],
  education:[
    {
      school:{
        type:String,
      },
      year:{
        type:String,
      },
      qualification:{
        type:String,
      },
      description:{
        type:String,
       
      }
    }
  ],
  extra:[
    {
      title:{type:String}
    }
  ],
 
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
});

module.exports = mongoose.model('Resume', ResumeSchema);