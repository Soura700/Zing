const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection");
const multer = require("multer");
const io = require("../socket");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

//delete post
router.delete("/delete_post/:userId/:postId", (req, res) => {
  const userId = req.params.userId;
  const postId = req.params.postId;
  try {
    connection.query(
      "DELETE FROM posts WHERE id = ? ",
      [postId],
      (error, results) => {
        if (error) {
          res.status(500).json(error);
        } else {
          res.status(200).json("Post has been deleted successfuly");
        }
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
});

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

  const images = req.files.map((file) => file.filename);

  const checkUserQuery = "SELECT id FROM users WHERE id = ?";
  const insertPostQuery =
    "INSERT INTO posts (userId, description , image) VALUES (?, ? , ?)";

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
          const newPost = {
            id: result.insertId,
            userId,
            description,
            image:images
          };
          io.emit('newPost', { newPost: newPost }); // Emit new post to all connected clients
          res.status(201).json({ id: result.insertId, ...req.body , images:images });
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

router.get("/allPosts", (req, res) => {
  connection.query("SELECT * FROM posts", (err, result) => {
    if (err) {
      console.log("Error Checking Posts");
      return res.status(500).json(err);
    } else {
      return res.status(200).json(result);
    }
  });
});

//update post
router.put("/update_post/:userId/:postId", (req, res) => {
  const userId = req.params.userId;
  const postId = req.params.postId;
  const description = req.body.description;
  //const images = req.body.images;
  try {
    connection.query(
      " UPDATE posts SET description = ? WHERE id = ? "[(description, postId)],
      (error, results) => {
        if (error) {
          res.status(500).json(error);
        } else {
          res.status(200).json("Post has been updated successfuly");
        }
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
});

// Like Change(update)
// router.put('/api/posts/:postId/like', async (req, res) => {
//   const postId = req.body.postId;
//   const userId = req.body.userId;

//   try {
//     // Update the like count in the database using a SQL query
//     connection.query(
//       'UPDATE post_likes SET likes = likes + 1 WHERE id = ? ',
//       [postId],
//       (err,result)=>{
//         if(err){
//           res.status(500).json(err)
//         }else{
//           res.status(200).json("Like updated successfully");
//         }
//       }
//     );

//     // Return the updated post data (including the new like count)
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error updating like count:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Update Like (Increamenet or decreament)
router.post("/like", (req, res) => {
  const postId = req.body.postId;
  const userId = req.body.userId; // Assuming userId is sent in the request body
  var likeStatus;
  // = req.body.likeStatus; // true for like, false for dislike

  // Check if the user has already liked the post
  connection.query(
    "SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?",
    [postId, userId],
    (error, results) => {
      if (error) {
        console.error("Error checking existing like:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results.length === 0) {
          console.log("User has no like on the post");
          likeStatus = true;
          // User has not liked the post, insert a new like
          connection.query(
            "INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)",
            [postId, userId],
            (error) => {
              if (error) {
                console.error("Error inserting like:", error);
                res.status(500).json({ error: "Internal Server Error" });
              } else {
                connection.query(
                  "SELECT userId FROM posts where id=?",
                  [postId],
                  (err, res) => {
                    if (err) {
                      console.log(
                        "Error in fetching the userid from the posts"
                      );
                      res
                        .status(500)
                        .json({
                          error: "Error in fetching the userdid from the posts",
                        });
                    } else {
                      // This is emitting the like event in the socket for the recent activity...

                      io.emit("like", {
                        postId: postId,
                        userid: res[0].userId,
                      });
                    }
                  }
                );
                // Liking the post socket event for the recent activities  to the userId
                // io.emit('like',{postId,userId});
                // Update like count in the posts table
                updateLikeCount(postId, likeStatus, res, true); // Pass true indicating user has liked the post
              }
            }
          );
        } else {
          // User has already liked the post, update the existing like
          likeStatus = false;
          connection.query(
            "DELETE FROM post_likes WHERE post_id = ? AND user_id = ?",
            [postId, userId],
            (error) => {
              if (error) {
                console.error("Error deleting like:", error);
                res.status(500).json({ error: "Internal Server Error" });
              } else {
                connection.query(
                  "SELECT userId FROM posts where id=?",
                  [postId],
                  (err, res) => {
                    if (err) {
                      console.log(
                        "Error in fetching the userid from the posts"
                      );
                      res
                        .status(500)
                        .json({
                          error: "Error in fetching the userdid from the posts",
                        });
                    } else {
                      console.log("User", res[0].userId);
                      console.log("Dislike")
                      console.log(results);
                      // This is emitting the dislike event in the socket for the recent activity status ... fro the user is is logged...Means i will check condition then will the the message...
                      io.emit("dislike", {
                        postId: postId,
                        userid: res[0].userId,
                      });
                    }
                  }
                );
                // Emit a 'like' event with the user ID
                // io.emit('disLike', { postId, userId });
                // Update like count in the posts table
                updateLikeCount(postId, likeStatus, res, false); // Pass false indicating user has disliked the post
              }
            }
          );
        }
      }
    }
  );
});

function updateLikeCount(postId, likeStatus, res, userLiked) {
  const incrementValue = likeStatus ? 1 : -1;

  console.log(likeStatus);
  console.log("Increament Value" + incrementValue);
  // Update like count in the posts table
  connection.query(
    "UPDATE posts SET likes = likes + ? WHERE id = ?",
    [incrementValue, postId],
    (error, results) => {
      if (error) {
        console.error("Error updating like count:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        connection.query(
          "SELECT likes,userId from posts where id = ?",
          [postId],
          (err, result) => {
            if (err) {
              console.error("Error updating like count:", error);
              res.status(500).json({ error: "Internal Server Error" });
            } else {
              console.log(result);

              // Emit an event to notify clients about the like change
              io.emit("updateLikes", {
                userid: result[0].userId,
                postId: postId,
                updatedLikes: result[0].likes,
              });
            }
          }
        );
        res.json({
          success: true,
          message: "Like updated successfully",
          userLiked,
        });
      }
    }
  );
}

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

// Fetching the posts by the timestamp and the userId
router.get("/posts_by_timestamp/:userId/:createdAt", async (req, res) => {
  const { userId, createdAt } = req.params;
  try {
    connection.query(
      "SELECT * FROM posts WHERE createdAt >= ? AND userId = ?  ORDER BY createdAt DESC",
      [createdAt, userId],
      (error, results) => {
        if (error) {
          res.status(500).json({ error });
        } else {
          const posts = results.map((result) => ({ ...result }));
          if (posts.length === 0) {
            res.status(401).json({ error: "No posts are there to show" });
          } else {
            res.status(200).json(posts);
          }
        }
      }
    );
  } catch (error) {
    console.error("Error fetching posts by timestamp:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
