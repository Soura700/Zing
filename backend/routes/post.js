const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection")


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage });



  
//delete post
router.delete("/delete_post/:userId/:postId", (req,res) => {
    const userId = req.params.userId;
    const postId = req.params.postId;
    try{
        connection.query(
            "DELETE FROM posts WHERE id = ? ",
            [postId],
            (error,results) =>{
                if (error) {
                    res.status(500).json(error);
                } else {
                    res.status(200).json("Post has been deleted successfuly");
                }
            }
        )
    }
    catch(error){
        res.status(500).json(error);
    }
})



//create post

  app.post("/api/posts", upload.array("images", 5), (req, res) => {
    const { userId, description } = req.body;
    const images = req.files.map((file) => file.filename);
  
    const checkUserQuery = "SELECT id FROM users WHERE id = ?";
    const insertPostQuery = "INSERT INTO posts (userId, description, images) VALUES (?, ?, ?)";
    const values = [userId, description, JSON.stringify(images)];
  
    // Check if the user exists
    connection.query(checkUserQuery, [userId], (err, results) => {
      if (err) {
        console.error("Error checking user existence:", err);
        res.status(500).json(err);
      } else if (results.length === 0) {
        res.status(400).json({ error: "User not found" });
      } else {
        // User exists, insert the post
        connection.query(insertPostQuery, values, (err, result) => {
          if (err) {
            console.error("Error creating post:", err);
            res.status(500).json(err);
          } else {
            res.status(201).json({ id: result.insertId, ...req.body, images });
          }
        });
      }
    });
  });





module.exports = router;