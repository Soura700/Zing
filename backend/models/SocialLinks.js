const mongoose = require('mongoose');

const SocialLinks = new mongoose.Schema(
  {
    userId:{
        type:Number,
        required:true
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },

    twitter: {
      type: String,
    },
    linkedIn: {
        type: String,
      },
    pinterest: {
        type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SocialLinks', SocialLinks);
