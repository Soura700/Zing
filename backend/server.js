const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
var connection = require("./connection")
var registerAuth = require("./routes/auth")
var postRoute = require("./routes/post")
const storiesRoute = require("./routes/stories")
const mongoose = require('mongoose');

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    credentials: true,
  }))

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

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

PORT = 5000;
app.use("/api/auth", registerAuth);
app.use("/api/posts", postRoute);
app.use("/api/stories",storiesRoute);

console.log("hello");

//step 5:
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));