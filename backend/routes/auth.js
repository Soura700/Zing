const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection")
const session = require("express-session");



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
        connection.query(
            userExistsQuery,
            [email],
            (error, results) => {
                if (results.length > 0) {
                    // User already exists, handle the error
                    return res.status(400).json({ errors: 'User already registered' });
                }
            }
        )


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




router.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const queryResult = await new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM users WHERE username = ? AND  user_password = ?",
                [username, password],
                (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                }
            );
        });

        if (queryResult.length > 0) {
            res.redirect("/welcome");
        } else {
            res.redirect("/");
        }
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("An error occurred");
    }
});




router.get("/check-cookie", (req, res) => {
    // Check if the session_token cookie exists
    if (req.cookies.user) {
  
  
  
      if(req.cookies.session_token){
  
      
        const session_cookie = req.cookies.session_token;
        const [customPart , userId] = session_cookie.split('_');
  
        if(customPart === 'custom' && userId ){
  
          res.status(200).json(userId);
          
          // res.status(200).json({ message: "Cookie exists" + " " +  userId  });
        }
  
        else{
  
          res.status(400).json({ message: "Cookie does not exist or has expired" });
  
        }
          
      }
    } else {
      res.status(400).json({ message: "Cookie does not exist or has expired" });
    }
  });
  
  


router.delete("/logout",(req,res)=>{
    // Delete Api (Session Delete);
})


// Done By bibha 
module.exports = router