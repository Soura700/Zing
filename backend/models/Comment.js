const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: Number,
      required: true,
    },

    userId: {
      type: Number,
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      require: true,
    },

  },{ timestamps: true }
  
);

module.exports = mongoose.model('Comment', CommentSchema);
