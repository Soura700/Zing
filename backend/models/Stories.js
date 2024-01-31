
// const mongoose = require("mongoose");

// const storySchema = new mongoose.Schema({
//   userId: { type: String, required: true },
//   userName: { type: String, required: true },
//   media: { type: String, required: true },
//   downloadURL: { type: String },  // Add downloadURL field
  
//   views: { type: Number, default: 0 }, // You can adjust the default value as needed
//   // Add other fields as needed
// });

// const Story = mongoose.model("Story", storySchema);

// module.exports = Story;
const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  media: { type: String, required: true },
  downloadURL: { type: String },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }, // Include creation time
  // Add other fields as needed
});

// Create TTL index on createdAt with expireAfterSeconds set to 30 seconds
storySchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
