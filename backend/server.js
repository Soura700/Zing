const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
var connection = require("./connection")
var registerAuth = require("./routes/auth")
var postRoute = require("./routes/post")

//Step 1:
dotenv.config();
// Step 2:
app.use(express.json());

//step 3:
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }

    console.log('Connected to the database');
});
PORT = 5000;
app.use("/api/auth", registerAuth);
app.use("/api/posts", postRoute);

console.log("hello");
//step 5:
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));