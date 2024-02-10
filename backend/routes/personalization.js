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

// router.put('/update-profile', upload.fields([{name:'profilePicture' , maxCount:1 } , {name:'coverPicture' , maxCount:1}]), (req, res) => {
//   const { userId, bio } = req.body;
//   // Check if a new profile picture was uploaded
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//     // profilePicturePath = req.file.path;
//   }

//   const profilePicturePath = req.file.path;
//   const updateQuery = 'UPDATE users SET profileImg = ? WHERE id = ?';
//   // const updateQuery = 'UPDATE `socialmedia`.`users` SET `profileImg` = ? WHERE id = ?';

//   connection.query(updateQuery, [ profilePicturePath, userId], (err, result) => {
//     if (err) {
//       console.error('Error updating profile in MySQL:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       // io.emit('profileUpdated',{userId,bio,profilePicturePath});
//       res.json({ message: 'Profile updated successfully!' });
//     }
//   });
// });


// router.put('/update-profile', upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'coverPicture', maxCount: 1 }]), (req, res) => {
//   const { userId, bio } = req.body;
  
//   let profilePicturePath = '';
//   let coverPicturePath = '';

//   // Check if profile picture was uploaded
//   if (req.files && req.files['profilePicture']) {
//     profilePicturePath = req.files['profilePicture'][0].path;
//   }

//   // Check if cover picture was uploaded
//   if (req.files && req.files['coverPicture']) {
//     coverPicturePath = req.files['coverPicture'][0].path;
//   }

//   const updateQuery = 'UPDATE users SET bio = ?, profileImg = ?, coverImg = ? WHERE id = ?';
//   const queryParams = [bio, profilePicturePath, coverPicturePath, userId];

//   connection.query(updateQuery, queryParams, (err, result) => {
//     if (err) {
//       console.error('Error updating profile in MySQL:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       res.json({ message: 'Profile updated successfully!' });
//     }
//   });
// });


router.put('/update-profile', upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'coverPicture', maxCount: 1 }]), (req, res) => {
  const { userId, bio } = req.body;
  
  let profilePicturePath = ''; // Initialize profilePicturePath
  let coverPicturePath = ''; // Initialize coverPicturePath

  // Check if profile picture was uploaded
  if (req.files && req.files['profilePicture']) {
    profilePicturePath = req.files['profilePicture'][0].path;
  }

  // Check if cover picture was uploaded
  if (req.files && req.files['coverPicture']) {
    coverPicturePath = req.files['coverPicture'][0].path;
  }

  // Construct the update query
  let updateQuery = 'UPDATE users SET bio = ?,';
  let queryParams = [bio];

  // Add profileImg to the query if a new profilePicture is uploaded
  if (profilePicturePath !== '') {
    updateQuery += ' profileImg = ?,';
    queryParams.push(profilePicturePath);
  }

  // Add coverImg to the query if a new coverPicture is uploaded
  if (coverPicturePath !== '') {
    updateQuery += ' coverImg = ?,';
    queryParams.push(coverPicturePath);
  }

  // Remove the trailing comma from the update query
  updateQuery = updateQuery.slice(0, -1);

  // Add the WHERE clause to the update query
  updateQuery += ' WHERE id = ?';
  queryParams.push(userId);

  // Execute the update query
  connection.query(updateQuery, queryParams, (err, result) => {
    if (err) {
      console.error('Error updating profile in MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Profile updated successfully!' });
    }
  });
});


module.exports = router;