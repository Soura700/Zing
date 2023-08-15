
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

// Set app port
app.listen(4000, () => {
    console.log("Server listening on port 4000");
});
console.log("hello")


// Done By bibha 
