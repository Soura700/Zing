const express = require("express");
const router = express.Router();
const Story = require("../models/Stories");

// Create a new story with photo or video
router.post("/create_story", async (req, res) => {
  const { userId, userName, media, downloadURL } = req.body;

  const story = new Story({
    userId,
    userName,
    views: 0,
    media,
    downloadURL,
  });

  try {
    const newStory = await story.save();
    res.status(201).json(newStory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all stories
router.get("/allStories", async (req, res) => {
  try {
    const stories = await Story.find();
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get stories for a specific user
router.get("/getStories/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const stories = await Story.find({ userId });
    const storiesCount = await Story.find({ userId }).count();
    res.status(200).json({ stories, storiesCount });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete a specific story
router.delete("/:id", async (req, res) => {
  try {
    const deletedStory = await Story.findByIdAndRemove(req.params.id);
    if (deletedStory) {
      // Log a message to the console in VS Code
      console.log("Story deleted successfully:", deletedStory);

      res.json({ message: "Story deleted successfully." });
    } else {
      res.status(404).json({ message: "Story not found." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
