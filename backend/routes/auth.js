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
                    console.log("User already registered")
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

//updated login code

/*const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use("/assets", express.static("assets"));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "nodejs",
});

// connect to the database
connection.connect((error) => {
    if (error) {
        throw error;
    } else {
        console.log("Connected to the database successfully!");
    }
});

app.use(express.json());

app.get('/', (req, res) => {
    const ip =
        req.headers['cf-connecting-ip'] ||
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress || '';

    return res.json({
        ip,
    });
});

// Middleware for parsing url-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const userIP =
        req.headers['cf-connecting-ip'] ||
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress || '';

    try {
        connection.query(
            "SELECT * FROM users WHERE username = ? AND  user_password = ?",
            [username, password],
            (error, results, fields) => {
                if (error) {
                    console.error("Error executing query:", error);
                    res.status(500).send("An error occurred");
                } else {
                    if (results.length > 0) {
                        // Insert IP address into database
                        connection.query('INSERT INTO ip_addresses (ip) VALUES (?)', [userIP], (error, results) => {
                            if (error) {
                                console.error("Error inserting IP:", error);
                            } else {
                                console.log("IP inserted into database");
                                res.redirect("/welcome");
                            }
                        });
                    } else {
                        res.redirect("/");
                    }
                }
            }
        );
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("An error occurred");
    }
});

app.get("/welcome", (req, res) => {
    res.sendFile(__dirname + "/welcome.html");
});

// Set app port
app.listen(4000, () => {
    console.log("Server listening on port 4000");
});*/
