const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
var connection = require("./connection")
var registerAuth = require("./routes/auth")
var postRoute = require("./routes/post")
const storiesRoute = require("./routes/stories")
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');


const io = require("socket.io")(5500,{
  cors:{
    origin:'http://localhost:3000'
  }
});

// Use the cookie-parser middleware
app.use(cookieParser());

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
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));



// io.on('connection',socket=>{
//   console.log(socket.id)
//   console.log('User Connected' , socket.id);
//   //Receveing 
//   socket.on('addUser',userId=>{
//     socket.userId = userId
//   })
//   // Sending from the backend...
//   io.emit('getUser',socket.userId);
// })

let users = []

io.on('connection',socket=>{
  console.log('User Connected' , socket.id);
  //Receveing 
  socket.on('addUser',userId=>{
    const userExists = users.find(user=>user.userId === userId);
     console.log("Users" + users);
     
    if(!userExists){
      const user = {userId , socketId : socket.id};
      users.push(user);
      io.emit('getUser',socket.userId);  // Sending from the backend...
      // io.emit('getUser',socket.userId); //Sending the stats like on line or offline 
    }
  })
})


PORT = 5000;
app.use("/api/auth", registerAuth);
app.use("/api/posts", postRoute);
app.use("/api/stories",storiesRoute);
app.use("/api/conversation" , conversationRoute);
app.use("/api/message" , messageRoute);

console.log("hello");

//step 5:
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));