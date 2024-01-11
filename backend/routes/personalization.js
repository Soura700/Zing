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
  const { bio, interests } = req.body;
  console.log("Bio" +bio);
  console.log("iNTERESTS" + interests);
  const profilePicturePath = req.file.path;
  console.log("Profilepicture path" + profilePicturePath);

  // Convert the interests array to a comma-separated string
  // const interestsString = interests.join(', ');

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

module.exports = router;