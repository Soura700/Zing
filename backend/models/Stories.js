const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    userId: {
        type: Number,
        
    },
    userName: {
        type: String,
        
    },
   views: {
    type: Number,
    default: 0,
  },
  expiry_time: {
    type: Date,
    default: null,
  },
  media: {
    type: String, // Assuming either 'photo' 
  },
  mediaUrl: {
    type: String, // Store the URL/path of the uploaded file
  },
}, { timestamps: true });
module.exports = mongoose.model("Story",StorySchema);