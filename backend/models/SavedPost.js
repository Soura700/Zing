// savedpost.js
const mongoose = require("mongoose");

const SavedPostSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    postId: {
      type: Number,
      required: true,
    },
    postUsername: {
      type: String,
    },
    description: {
      type: String, // Add a new field to store the description
    },
    images: [
      {
        type: String, // Assuming the image property is a string representing the filename
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavedPost", SavedPostSchema);
