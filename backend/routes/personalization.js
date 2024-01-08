const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');

const app = express();

// MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "nodejs",
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

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
app.post('/upload', upload.single('profilePicture'), (req, res) => {
  const { bio, interests } = req.body;
  const profilePicturePath = req.file.path;

  // Convert the interests array to a comma-separated string
  const interestsString = interests.join(', ');

  // Insert data into MySQL table
  const insertQuery = 'INSERT INTO user_profiles (profile_picture, bio, interests) VALUES (?, ?, ?)';
  db.query(insertQuery, [profilePicturePath, bio, interestsString], (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Data stored successfully!' });
    }
  });
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});