const express = require('express');
const multer = require('multer');
const path = require('path');
const connection = require("../connection");

const router = express();




// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Route to handle file upload and store data in MySQL
router.post('/upload', upload.single('profilePicture'), (req, res) => {


  const {userId} = req.body;
  const { bio } = req.body;

  const profilePicturePath = req.file.path;

  // Insert data into MySQL table
  const insertQuery = 'UPDATE users SET profileImg = ?, bio = ? WHERE id = ?';
  // 'UPDATE users SET (profile_picture, bio) VALUES (?, ?) WHERE id = ? ';
  connection.query(insertQuery, [profilePicturePath, bio, userId], (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Data stored successfully!' });
    }
  });
});

// Update the user bio and the profileImg

router.put('/update-profile', upload.single('profilePicture'), (req, res) => {
  const { userId, bio } = req.body;
  let profilePicturePath = '';

  // Check if a new profile picture was uploaded
  if (req.file) {
    profilePicturePath = req.file.path;
  }

  // Update the bio and/or profile image in the MySQL table
  const updateQuery = 'UPDATE users SET bio = ?, profileImg = ? WHERE id = ?';
  connection.query(updateQuery, [bio, profilePicturePath, userId], (err, result) => {
    if (err) {
      console.error('Error updating profile in MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      io.emit('profileUpdated',{userId,bio,profilePicturePath});
      res.json({ message: 'Profile updated successfully!' });
    }
  });
});

module.exports = router;