
const express = require('express');
const router = express.Router();
const Story = require('../models/Stories');
const multer = require('multer');
const path = require('path');
const cron = require('node-cron');

// Multer configuration for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory where files will be stored
  },
  filename: function (req, file, cb) {
    
    cb(null, file.fieldname + '-' + Date.now()  + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Schedule a job to delete expired stories every 30 seconds
cron.schedule('0 0 * * *', async () => {
  console.log("Cronjob Started");
  try {
    const currentDate = new Date();
    const twentyFourHoursAgo = new Date(currentDate - 24 * 60 * 60 * 1000); // 24 hours ago
    const expiredStories = await Story.find({ expiry_time: { $lt: twentyFourHoursAgo } });

    // Remove expired stories from the database
    for (const story of expiredStories) {
      await Story.findByIdAndRemove(story.id);
    }

    console.log('Expired stories deleted successfully.');
  } catch (err) {
    console.error('Error deleting expired stories:', err.message);
  }
});

// Get all stories
router.get('/allStories', async (req, res) => {
  try {
    const stories = await Story.find();
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/getStories/:userId", async(req,res)=>{
  const {userId} = req.params;
  try{
    const stories = await Story.find({userId})

    res.status(200).json(stories);
  }catch(error){
    res.status(500).json(error)
  }
})

// Create a new story with photo or video
router.post('/create_story', upload.single('mediaFile'), async (req, res) => {
  const expiryTime = new Date();
  expiryTime.setHours(expiryTime.getHours() + 24);

  const story = new Story({
    userId: req.body.userId,
    userName: req.body.userName,
    views: 0,
    expiry_time: expiryTime,
    media: req.body.media, // 'photo' or 'video'
    mediaUrl: req.file ? req.file.path : null, // Store the file path in mediaUrl
  });

  try {
    const newStory = await story.save();
    res.status(201).json(newStory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a specific story
router.delete('/:id', async (req, res) => {
  try {
    const deletedStory = await Story.findByIdAndRemove(req.params.id);
    if (deletedStory) {
      res.json({ message: 'Story deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Story not found.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
