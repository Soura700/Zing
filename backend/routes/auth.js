const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection");
const session = require("express-session");

router.use(
  session({
    name: "socialmedia",
    secret: "soura@700@2004#1234",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    },
  })
);

// register api // all working

router.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.user_password;
  const email = req.body.email;

  const salt = await bcrypt.genSalt(12);
  const hashedPass = await bcrypt.hash(password, salt);

  try {
    //check if the user already exists or not(by email)
    const userExistsQuery = "SELECT email FROM users WHERE email = ?";
    connection.query(userExistsQuery, [email], (error, results) => {
      if (results.length > 0) {
        // User already exists, handle the error
        console.log("User already registered");
        return res.status(400).json({ errors: "User already registered" });
      }
    });

    connection.query(
      "INSERT INTO users (username, email, user_password) VALUES (?, ?, ?)",
      [username, email, hashedPass],
      (error, results) => {
        if (error) {
          // res.status(500).json(error);
        } else {
          res.status(200).json(results);
        }
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
});

// router.post("/login", async (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;

//     try {
//         const queryResult = await new Promise((resolve, reject) => {
//             connection.query(
//                 "SELECT * FROM users WHERE username = ? AND  user_password = ?",
//                 [username, password],
//                 (error, results, fields) => {
//                     if (error) {
//                         reject(error);
//                     } else {
//                         resolve(results);
//                     }
//                 }
//             );
//         });

//         if (queryResult.length > 0) {
//             res.redirect("/welcome");
//         } else {
//             res.redirect("/");
//         }
//     } catch (error) {
//         console.error("Error executing query:", error);
//         res.status(500).send("An error occurred");
//     }
// });

router.get("/", (req, res) => {
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  return res.json({
    ip,
  });
});

// router.post(
//   "/login",
//   async (req, res) => {
//     try {
//       const email = req.body.email;

//       const userIP =
//         req.headers["cf-connecting-ip"] ||
//         req.headers["x-real-ip"] ||
//         req.headers["x-forwarded-for"] ||
//         req.socket.remoteAddress ||
//         "";

//       connection.query(
//         "SELECT * FROM users WHERE email = ?",
//         [email],
//         async (err, result) => {
//           if (err) {
//             return res.status(500).json({ error: "Internal Server Error" });
//           }

//           if (result.length === 0) {
//             return res.status(400).json({ error: "User Not Found" });
//           }

//           const user = result[0];

//           var password = req.body.user_password;

//           const isPasswordValid = await bcrypt.compare(
//             password,
//             user.user_password
//           );

//           if (!isPasswordValid) {
//             return res.status(400).json({ error: "Wrong Credentials" });
//           }

//           req.session.userId = user.id;

//           const userId = user.id.toString();
//           const customValue = `custom_${userId}`;

//           res.cookie("session_token", customValue, {
//             httpOnly: true,
//             expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
//           });

//           // Update current_login_time
//           connection.query(
//             "UPDATE users SET ip_addresses = ? WHERE email = ?",
//             [userIP, email],
//             (error, results) => {
//               if (error) {
//                 console.error("Error updating IP:", error);
//                 return res.status(500).json(error);
//               } else {
//                 console.log("IP updated in database");
//                 // return res.status(200).json(results);
//               }
//             }
//           );

//           res.status(200).json(user);
//         }
//       );
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
//   // }
// );


router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.user_password;

  const userIP =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  try {
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) {
          console.error("Error executing query:", error);
          return res.status(500).send("An error occurred");
        }

        if (results.length > 0) {
          const storedHashedPassword = results[0].user_password;
          const passwordMatches = await bcrypt.compare(
            password,
            storedHashedPassword
          );

          if (passwordMatches) {
            // New From Soura (5/9/2023)

            req.session.userId = results[0].id;
            const userId = results[0].id.toString();
            const customValue = `custom_${userId}`;

            res.cookie('session_token_socialmedia', customValue, { httpOnly: true, expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) });

            // Insert IP address into database
            connection.query(
              "UPDATE users SET ip_addresses = ? WHERE email = ?",
              [userIP, email],
              (error, results) => {
                if (error) {
                  console.error("Error updating IP:", error);
                  return res.status(500).json(error);
                } else {
                  console.log("IP updated in database");
                  return res.status(200).json(results);
                }
              }
            );
          } else {
            // Password doesn't match
            res.redirect("/");
          }
        } else {
          // No user found
          res.redirect("/");
        }
      }
    );
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send("An error occurred");
  }
});

router.get("/check-cookie", (req, res) => {
  // Check if the session_token cookie exists

  if (req.cookies.socialmedia) {
    if (req.cookies.session_token_socialmedia) {
      const session_cookie = req.cookies.session_token_socialmedia;

      const [customPart, userId] = session_cookie.split("_");

      if (customPart === "custom" && userId) {
        res.status(200).json(userId);

        // res.status(200).json({ message: "Cookie exists" + " " +  userId  });
      } else {
        res
          .status(400)
          .json({ message: "Cookie does not exist or has expired" });
      }
    }
  } else {
    res.status(400).json({ message: "Cookie does not exist or has expired" });
  }
});

router.delete("/logout", (req, res) => {
  // Delete Api (Session Delete);
});

router.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  try {
    connection.query(
      "SELECT * FROM users WHERE id = ?",
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

// Done By bibha
module.exports = router;
