const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection")
const multer = require("multer");


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

  // router.post("/create", upload.array("images", 5), (req, res) => {
  //   const { userId, description } = req.body;
    
  //   const images = req.files.map((file) => file.filename);
  
  //   const checkUserQuery = "SELECT id FROM users WHERE id = ?";
  //   const insertPostQuery = "INSERT INTO posts (userId, description, images) VALUES (?, ?, ?)";
  //   const values = [userId, description, JSON.stringify(images)];
  
  //   // Check if the user exists
  //   connection.query(checkUserQuery, [userId], (err, results) => {
  //     if (err) {
  //       console.error("Error checking user existence:", err);
  //       res.status(500).json(err);
  //     } else if (results.length === 0) {
  //       res.status(400).json({ error: "User not found" });
  //     } else {
  //       // User exists, insert the post
  //       connection.query(insertPostQuery, values, (err, result) => {
  //         if (err) {
  //           console.error("Error creating post:", err);
  //           res.status(500).json(err);
  //         } else {
  //           res.status(201).json({ id: result.insertId, ...req.body, images });
  //         }
  //       });
  //     }
  //   });
  // });


  router.post("/create", upload.array("images", 5), (req, res) => {
    const { userId, description } = req.body;
    
    // const images = req.files.map((file) => file.filename);
  
    const checkUserQuery = "SELECT id FROM users WHERE id = ?";
    const insertPostQuery = "INSERT INTO posts (userId, description) VALUES (?, ?)";

    const values = [userId, description];
  
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
            res.status(201).json({ id: result.insertId, ...req.body });
          }
        });
      }
    });
  });


  // // Get All post 

  // router.get("/allPosts", (req, result) => {  
  //   // Check if the user exists
  //   connection.query('SELECT * FROM posts', (err, results) => {
  //     if (err) {
  //       console.error("Error checking posts:", err);
  //       return result.status(500).json(err);
  //     } else {
  //          return result.status(201).json(result);
  //         }
  //       });
  //   });

  router.get("/allPosts",(req,res)=>{
    connection.query('SELECT * FROM posts',(err,result)=>{
      if(err){
        console.log("Error Checking Posts");
        return res.status(500).json(err)
      }else{
        return res.status(200).json(result)
      }
    })
  })

//update post
router.put("/update_post/:userId/:postId", (req,res) => {
  const userId = req.params.userId;
  const postId = req.params.postId;
  const description = req.body.description;
  //const images = req.body.images;
  try{
      connection.query(
          " UPDATE posts SET description = ? WHERE id = ? "
          [description,postId],
          (error,results) =>{
              if (error) {
                  res.status(500).json(error);
              } else {
                  res.status(200).json("Post has been updated successfuly");
              }
          }
      )
  }
  catch(error){
      res.status(500).json(error);
  }
})


// Get Post by Id
router.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  try {
    connection.query(
      "SELECT * FROM posts WHERE userId = ?",
      [userId], // Add a comma here to separate the query string from the parameter array
      (error, results) => {
        if (error) {
          return res.status(500).json(error);
        } else {
          return res.status(200).json(results);
        }
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
});





module.exports = router;