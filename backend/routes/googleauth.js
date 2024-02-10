const express = require("express");
var router = express();
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const GoogleUsersSchema = require("../models/GoogleLogin");
const connection = require("../connection");
const bcrypt = require("bcrypt");
const { error } = require("neo4j-driver");

//google login part (31/01/2024) biggo
const clientid =
  "231997424747-9ienc0200l40d31m8kicf4lpic8cpt84.apps.googleusercontent.com";
const clientsecret = "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";

//setup session
router.use(
  session({
    name: "user",
    secret: "soura@700@2004#1234",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    },
  })
);

//setup passport
router.use(passport.initialize());
router.use(passport.session());

// In your route handler for the OAuth callback URL
router.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, userId) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Handle authentication failure
      return res.redirect("http://localhost:3000/login");
    }
    const customValue = `custom_${userId}`;
    res.cookie("session_token", customValue, {
      httpOnly: true,
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    });
    // res.redirect('http://localhost:3000');
    res.redirect(`http://localhost:3000/profile_setting/${userId}`);
  })(req, res, next);
});

passport.use(
  new OAuth2Strategy(
    {
      clientID: clientid,
      clientSecret: clientsecret,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
      passReqToCallback: true,
    },

    (req, accessToken, refreshToken, profile, done) => {
      console.log("profile", profile);
      try {
        // Check if the email exists in the MySQL database
        connection.query(
          "SELECT * FROM users WHERE email = ?",
          [profile.emails[0].value],
          (err, existingUser) => {
            if (err) {
              console.error("Error checking user in MySQL:", err);
              return done(err);
            }
            if (existingUser.length > 0) {
              req.login(existingUser[0], (loginErr) => {
                const userId = existingUser[0].id;
                const stingUserId = userId.toString();
                const customValue = `custom_${stingUserId}`;
                req.res.cookie("session_token", customValue, {
                  httpOnly: true,
                  expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                });

                return req.res.redirect("http://localhost:3000");
              });
            } else {
              const hashedPassword = bcrypt.hashSync(
                Math.random().toString(36).slice(-8),
                10
              );
              // Check if the user exists in MySQL by Google ID and email
              connection.query(
                "SELECT * FROM users WHERE email = ?",
                [profile.emails[0].value],
                (error, existingUserInMySQL) => {
                  if (error) {
                    console.error("Error checking user in MySQL:", error);
                    return done(error);
                  }
                  if (existingUserInMySQL.length === 0) {
                    // If the user doesn't exist in MySQL, create a new user
                    const user = GoogleUsersSchema({
                      googleId: profile.id,
                      displayName: profile.displayName,
                      email: profile.emails[0].value,
                      image: profile.photos[0].value,
                    });
                    user.save();
                    connection.query(
                      "INSERT INTO users (username, email, profileImg, user_password) VALUES (?, ?, ?, ?)",
                      [
                        profile.displayName,
                        profile.emails[0].value,
                        profile.photos[0].value,
                        hashedPassword,
                      ],
                      (insertError, result) => {
                        if (insertError) {
                          console.error(
                            "Error inserting user into MySQL:",
                            insertError
                          );
                          return done(insertError);
                        } else {
                          const userId = result.insertId.toString();
                          const customValue = `custom_${userId}`;
                          return done(null, user, userId); // Pass the user object and userId to the next middleware
                        }
                      }
                    );
                  } else {
                    // Redirect the user
                    return req.res.redirect("http://localhost:3000");
                  }
                }
              );
            }
          }
        );
      } catch (error) {
        console.log("Error:", error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// initial google oauth login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000",
    failureRedirect: "http://localhost:3000/login",
  })
);

router.get("/login/sucess", async (req, res) => {
  if (req.user) {
    res.status(200).json({ message: "user Login", user: req.user });
  } else {
    res.status(400).json({ message: "Not Authorized" });
  }
});

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:3000");
  });
});

module.exports = router;
