
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection")
//register api
router.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.user_password;
    const email = req.body.email;

    try {
        connection.query(
            "INSERT INTO users (username, email, user_password) VALUES (?, ?, ?)",
            [username, email, password],
            (error, results) => {
                if (error) {
                    res.status(500).json(error);
                } else {
                    res.status(200).json(results);
                }
            }
        );
    } catch (error) {
        res.status(500).json(error);
    }
});

// Middleware for parsing url-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/login", async (req, res) => {
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

app.get("/welcome", (req, res) => {
    res.sendFile(__dirname + "/welcome.html");
});




// Done By bibha 
