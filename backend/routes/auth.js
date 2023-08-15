
const mysql = require("mysql2");
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

// Middleware for parsing url-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});




//register api

app.post("/register",  (req, res) => {
    const username = req.body.username;
    const email = req.body.email
    const password = req.body.password;

    try {
            connection.query(
                "INSERT INTO users VALUES (username, user_email, user_password)",
                [username, email, password],
                (error, results) => {
                    if (error) {
                        res.status(500).json(error);
                    } else {
                        res.status(200).json(results);
                    }
                }
            );
    }

    catch (error) {
        res.status(500).json(error);
    }


});





//login api


router.post("/login",  async(req, res) => {
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

    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("An error occurred");
    }
});



// Done By bibha 
