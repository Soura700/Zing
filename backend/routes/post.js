const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection");
const multer = require("multer");
const io = require("../socket");
const path = require("path");
const ShareLinkSchema = require("../models/ShareLinkSchema");
const SavedPost = require("../models/SavedPost");
const { v4: uuidv4 } = require('uuid');


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
          io.emit("postDelete",{postId});
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

// router.post("/create", upload.array("images", 5), (req, res) => {
//   const { userId, description , username } = req.body;

//   const images = req.files.map((file) => file.filename);

//   const checkUserQuery = "SELECT id FROM users WHERE id = ?";
//   const insertPostQuery =
//     "INSERT INTO posts (userId, username, description , image) VALUES (?, ? , ? , ?)";
//     const getPostQuery =
//     "SELECT id, createdAt FROM posts WHERE id = ?";


//   const values = [userId, username, description, JSON.stringify(images)];

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

//           const postId = result.insertId;

//           const newPost = {
//             id: result.insertId,
//             userId,
//             description,
//             username,
//             image:images
//           };
//           io.emit('newPost', { newPost: newPost , username:username , userId:userId }); // Emit new post to all connected clients
//           res.status(201).json({ id: result.insertId, ...req.body , images:images });
//         }
//       });
//     }
//   });
// });

// router.post("/create", upload.array("images", 5), (req, res) => {
//   const { userId, description, username } = req.body;
//   const images = req.files.map((file) => file.filename);

//   const checkUserQuery = "SELECT id FROM users WHERE id = ?";
//   const insertPostQuery =
//     "INSERT INTO posts (userId, username, description, image) VALUES (?, ?, ?, ?)";
//   const getPostQuery =
//     "SELECT id, createdAt FROM posts WHERE id = ?";

//   const values = [userId, username, description, JSON.stringify(images)];

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
//           const postId = result.insertId;
//           // Fetch the createdAt timestamp of the newly inserted post
//           connection.query(getPostQuery, [postId], (err, postResult) => {
//             if (err) {
//               console.error("Error fetching post data:", err);
//               res.status(500).json(err);
//             } else {
//               const newPost = {
//                 id: postId,
//                 userId,
//                 description,
//                 username,
//                 image: images,
//                 createdAt: postResult[0].createdAt // Add createdAt field
//               };
//               io.emit('newPost', { newPost: newPost, username: username, userId: userId }); // Emit new post to all connected clients
//               res.status(201).json({ id: postId, ...req.body, images: images });
//             }
//           });
//         }
//       });
//     }
//   });
// });

router.post("/create", upload.array("images", 5), async (req, res) => {
  const { userId, description, username } = req.body;
  const images = req.files.map((file) => file.filename);

  // Sightengine API call to check for nudity
  try {
    const form = new FormData();
    images.forEach((image) => {
      form.append("media", fs.createReadStream(`uploads/${image}`));
    });
    form.append("models", "nudity-2.0");
    form.append("api_user", "1498986529");
    form.append("api_secret", "77xk4zUxM6gJBVsftXLohCjsCKxuyzGw");

    const sightEngineResponse = await axios.post(
      "https://api.sightengine.com/1.0/check.json",
      form,
      {
        headers: form.getHeaders(),
      }
    );

    const nudity = sightEngineResponse.data.nudity;
    // Check nudity score
    if (
      nudity &&
      (nudity.sexual_activity > 0.5 ||
        nudity.sexual_display > 0.5 ||
        nudity.erotica > 0.5 ||
        nudity.sexy > 0.5)
    ) {
      // If nudity detected, reject the post
      return res.status(400).json({
        error: "Nudity detected in the images. 18+ content cannot be uploaded.",
      });
    }

    // Proceed to save the post if no nudity detected
    const checkUserQuery = "SELECT id FROM users WHERE id = ?";
    const insertPostQuery =
      "INSERT INTO posts (userId, username, description , image) VALUES (?, ? , ? , ?)";
    const values = [userId, username, description, JSON.stringify(images)];

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
              image: images,
            };
            io.emit("newPost", { newPost: newPost, userId: userId }); // Emit new post to all connected clients
            res
              .status(201)
              .json({ id: result.insertId, ...req.body, images: images });
          }
        });
      }
    });
  } catch (error) {
    console.error("Error checking nudity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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
router.put("/update_post/:userId/:postId", upload.array("images", 1), (req, res) => {
  const userId = req.params.userId;
  const postId = req.params.postId;
  const description = req.body.description;
  const newImages = req.files.map((file) => file.filename);

  try {
    // First, fetch the existing images and description for the post
    connection.query(
      "SELECT description, image FROM posts WHERE id = ?",
      [postId],
      (error, results) => {
        if (error) {
          res.status(500).json(error);
          console.log("Error");
          console.log(error);
        } else {
          const existingImages = JSON.parse(results[0].image);
          const existingDescription = results[0].description;
          const updatedImages = existingImages.concat(newImages);
          if (updatedImages.length > 4) {
            res.status(400).json({
              error: "Maximum number of images (4) exceeded for this post",
            });
            return;
          }
          let sqlQuery = "UPDATE posts SET ";
          const sqlParams = [];
          if (description) {
            sqlQuery += "description = ?, ";
            sqlParams.push(description);
          } else {
            sqlQuery += "description = ?, ";
            sqlParams.push(existingDescription);
          }
          sqlQuery += "image = ? WHERE id = ?";
          sqlParams.push(JSON.stringify(updatedImages), postId);
          // Execute the SQL query
          connection.query(sqlQuery, sqlParams, (error, results) => {
            if (error) {
              res.status(500).json(error);
            } else {
              io.emit('postUpdated', { postId: postId, description: description || existingDescription, image: updatedImages });
              res.status(200).json("Post has been updated successfully");
            }
          });
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
  const userId = req.body.userId; // Assuming userId is sent in the request body (The user whi is liking or disliking the post ) 
  console.log("UserId" + userId)
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
                        postId: postId, //The 
                        userid: res[0].userId,
                        likeUser:userId
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
                        dislikeUser:userId
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
      "SELECT * FROM posts WHERE userId = ? ORDER BY createdAt DESC",
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

router.get('/get_post_by_id/:postId', (req, res) => {
  const postId = req.params.postId;
  try {
    connection.query(
      'SELECT * FROM posts WHERE id = ?',
      [postId], // Add a comma here to separate the query string from the parameter array
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
router.get("/posts_by_timestamp/:userId/:updatedAt", async (req, res) => {
  const { userId, updatedAt } = req.params;
  try {
    connection.query(
      "SELECT * FROM posts WHERE createdAt >= ? AND userId = ?  ORDER BY createdAt DESC",
      [updatedAt, userId],
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

//share post API (04/02/2024)
router.post('/share_post/:postId', async (req, res) => {
  const postId = req.params.postId;
  console.log(postId);
  const updateQuery = 'SELECT * FROM posts WHERE id = ?';

  try {
    connection.query(updateQuery, [postId], async (err, result) => {
      if (err) {
        console.error('Error updating profile in MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log("Result");
        console.log(result[0].id);
        const post = await ShareLinkSchema.findOne({ postId: postId });
       
        if (!post) {
          const link = `https://localhost:3000/posts/${result[0].id}/${uuidv4()}`;
          const newPostLink = new ShareLinkSchema({
            postId: result[0].id,
            shareLink: link
          });
          const postLink = await newPostLink.save();
          return res.status(200).json(link);
        }
        else {
          const link2 = `https://localhost:3000/posts/${result[0].id}/${uuidv4()}`;
          post.shareLink = link2;
          await post.save();
          return res.status(200).json(link2);
        }
      }
    })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//get shared link from database by post ID (06/02/2024)
router.get('/get_post/sharelink', async (req, res) => {
  
  // const {shareLink} = req.query;
  const {shareLink} = req.params;

  const splitLink = shareLink.split("/");
  const postId = splitLink[4];
  try {
  
    if (!postId) {
      return res.status(404).json({ error: 'PostId not found' });
    }
    const getPostQuery = 'SELECT * FROM posts WHERE id = ?';

    connection.query(getPostQuery, [postId], (err, result) => {
      if (err) {
        console.error('Error retrieving post from MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const post = result[0];
        // res.redirect("/posts/:id/:uuid");
        return res.status(200).json(post);
      }
    });
  } catch (error) {
    console.error('Error retrieving post:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get("/check_like/:postId/:userId", (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId;

  // Query to check if the user has liked the post
  const checkLikeQuery =
    "SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?";

  // Execute the query
  connection.query(checkLikeQuery, [postId, userId], (error, results) => {
    if (error) {
      console.error("Error checking like:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (results.length > 0) {
        // The user has liked the post
        res.status(200).json({ liked: true });
      } else {
        // The user has not liked the post
        res.status(200).json({ liked: false });
      }
    }
  });
});

// 10/2/2024
// Saved Post get Api
router.get("/saved_posts/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const savedPosts = await SavedPost.find({ userId });
    res.status(200).json(savedPosts);
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Save post to MongoDB
router.post("/save_post", async (req, res) => {
  const { userId, postId } = req.body;

  try {
    // Fetch description from the MySQL "posts" table
    const postQuery = "SELECT description, userId FROM posts WHERE id = ?";
    connection.query(postQuery, [postId], async (error, results) => {
      if (error) {
        console.error("Error fetching post details:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (results.length === 0) {
        res.status(404).json({ error: "Post not found" });
      } else {
        const { description, userId: postUserId } = results[0];

        // Fetch username from the MySQL "users" table
        const userQuery = "SELECT username FROM users WHERE id = ?";
        connection.query(
          userQuery,
          [postUserId],
          async (error, userResults) => {
            if (error) {
              console.error("Error fetching username:", error);
              res.status(500).json({ error: "Internal Server Error" });
            } else if (userResults.length === 0) {
              res.status(404).json({ error: "User not found" });
            } else {
              const postUsername = userResults[0].username;

              // Update the MongoDB document with fetched details
              const savedPost = new SavedPost({
                userId,
                postId,
                postUsername,
                description,
                images: req.body.images,
              });

              await savedPost.save();

              res.status(201).json({ message: "Post saved successfully" });
            }
          }
        );
      }
    });
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;
