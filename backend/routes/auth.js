const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection");
const session = require("express-session");
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const { check, validationResult } = require("express-validator");

router.use(
  session({
    name: "user",
    secret: "soura@700@2004#1234",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
      // maxAge: 2 * 60 * 1000,
    },
  })
);

// register api // all working

router.post(
  "/register",
  [
    check("username","Username must be +3 characters long")
      .exists()
      .isLength({ min: 3 }),
    check("email", "Email is not valid")
      .notEmpty()
      .withMessage("Email cannot be empty"),
    check("user_password", "")
      .isLength({ min: 8, max: 32 })
      .withMessage("Password must be in range of 8 to 32")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one numeric character")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one special character"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    const errorMessages = errors
      .array()
      .map((error) => `${error.msg}`)
      .join("@");

    // const errorMessages = errors.array().map(error => {error.msg}).join('');

    if (!errors.isEmpty()) {
      // return res.status(422).json({
      //     errors:errors.array()
      // });
      return res.status(400).send(errorMessages);
    } else {
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
            return res.status(409).json({ errors: "User already registered" });
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
    }
  }
);

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

router.post(
  "/login",
  [
    check("email", "Email is not valid")
      .notEmpty()
      .withMessage("Email cannot be empty"),
    check("user_password", "")
      .notEmpty()
      .withMessage("Password cannot be empty"),
  ],

  async (req, res) => {

    const errors = validationResult(req);


    const errorMessages = errors.array().map((error) => `${error.msg}`).join("@");

    if (!errors.isEmpty()) {
      // return res.status(422).json({
      //     errors:errors.array()
      // });
      return res.status(400).send(errorMessages);
    } else {
      try {
        const email = req.body.email;

        const userIP =
          req.headers["cf-connecting-ip"] ||
          req.headers["x-real-ip"] ||
          req.headers["x-forwarded-for"] ||
          req.socket.remoteAddress ||
          "";

        connection.query(
          "SELECT * FROM users WHERE email = ?",
          [email],
          async (err, result) => {
            if (err) {
              return res.status(500).json({ error: "Internal Server Error" });
            }

            if (result.length === 0) {
              return res.status(404).json({ error: "User Not Found" });
            }

            const user = result[0];

            var password = req.body.user_password;

            const isPasswordValid = await bcrypt.compare(
              password,
              user.user_password
            );

            if (!isPasswordValid) {
              return res.status(401).json({ error: "Wrong Credentials" });
            }

            req.session.userId = user.id;

            const userId = user.id.toString();
            const customValue = `custom_${userId}`;

            res.cookie("session_token", customValue, {
              httpOnly: true,
              expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            });

            // Update current_login_time
            connection.query(
              "UPDATE users SET ip_addresses = ? WHERE email = ?",
              [userIP, email],
              (error, results) => {
                if (error) {
                  console.error("Error updating IP:", error);
                  return res.status(500).json(error);
                } else {
                  console.log("IP updated in database");
                  // return res.status(200).json(results);
                }
              }
            );

            res.status(200).json(user);
          }
        );
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
);

router.get("/check-cookie", (req, res) => {
  // Check if the session_token cookie exists
  if (req.cookies.user) {
    if (req.cookies.session_token) {
      const session_cookie = req.cookies.session_token;
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

router.post("/:userId", (req, res) => {
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



// Search suggestion API endpoint
router.get("/search-suggestions", (req, res) => {
  // Extract the search query from the request query parameters
  const { query } = req.query;

  // SQL query to fetch matching usernames from the database
  const searchQuery = `
    SELECT username FROM users
    WHERE username LIKE CONCAT('%', ?, '%')
    LIMIT 5;
  `;

  // Execute the SQL query
  connection.query(searchQuery, [query], (error, results) => {
    if (error) {
      // Handle database error
      console.error("Error executing SQL query:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      // Extract usernames from the query results
      const usernames = results.map((result) => result.username);
      res.status(200).json(usernames);
    }
  });
});


//30/01/2024 (biggo)

//forgot password
router.post("/password/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Email");
    console.log(email);
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email], // Add a comma here to separate the query string from the parameter array
      (error, results) => {
        if (error) {
          return res.status(500).json(error);
        } else {
          if (!results[0].email) {
            return res.status(409).json('User is not registered');
          } else {
            const secret = process.env.SECRET_KEY + results[0].user_password;
            const payload = {
              email: results[0].email,
              id: results[0].id,
            };
            const token = jwt.sign(payload, secret, { expiresIn: '10m' });
            const link = `http://localhost:3000/resetpassword/${results[0].id}/${token}`;
            let transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'sourabose66@gmail.com',
                pass: 'weelmmnyhsodglmw',
              },
            });

            let message = {
              from: 'sourabose66@gmail.com',
              to: results[0].email,
              subject: 'Password Reset',
              text: link,
            };
            transporter.sendMail(message, (error, info) => {
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
            console.log(link);
            res.send('Password link has been sent...');
          }
        }
      }
    );

  } catch (error) {
    console.log(error);
  }
});


//reset password
router.get('/resetpassword/:id/:token', async (req, res) => {
  const { id, token } = req.params;
  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [id], // Add a comma here to separate the query string from the parameter array
    (error, results) => {
      if (error) {
        return res.status(500).json(error);
      } else {
        if (!results[0].id) {
          return res.status(409).json('User is not registered');
        } else {
          try{
            const secret = process.env.SECRET_KEY + user.password;
            const payload = jwt.verify(token, secret);
            res.redirect("/resetpassword/:id/:token");
          }catch(error){
            res.status(500).json(error);

          }
        }
      }
    }
  )
});

//update password
router.post("/resetpassword/:id/:token", async (req, res, next) => {
  const { id, token } = req.params;
  console.log(id);
  console.log(req.body.user_password);

  // Fetch the user from the database based on id
  connection.query('SELECT * FROM users WHERE id = ?', id, async (error, results, fields) => {
    if (error) {
      console.error('Error fetching user from MySQL database: ', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Check if the user exists
    if (results.length === 0) {
      return res.json({ status: "User does not exist" });
    }

    const user = results[0];
    console.log(user);
    console.log(user.user_password);
    const secret = process.env.SECRET_KEY + user.user_password;

    try {
      // Verify the token
      const payload = jwt.verify(token, secret);

      // Hash the new password
      const salt = await bcrypt.genSalt(12);
      const hashedPass = await bcrypt.hash(req.body.user_password, salt);

      console.log("Hashed Password");
      console.log(hashedPass);

      // Update the user's password in the database
      connection.query('UPDATE users SET user_password = ? WHERE id = ?', [hashedPass, id], (updateError, updateResults, updateFields) => {
        if (updateError) {
          console.error('Error updating password in MySQL database: ', updateError);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ msg: "Password Updated" });
      });
    } catch (error) {
      console.error('Error resetting password: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});


module.exports = router;

