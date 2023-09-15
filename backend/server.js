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
const groupRoute = require("./routes/group");
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



// let users = [];

// io.on('connection', (socket) => {

//   console.log('User Connected', socket.id);

//   socket.on('addUser', (userId) => {

//     const userExists = users.find((user) => {
//       // console.log("userId" + user.userId + typeof( user.userId));
//       return user.userId === userId
//     });

//     // console.log(users);

//     if (userExists) {
//       // console.log("User already exists");
//     } else {
//       // console.log("User doesn't exist");

//       const user = { userId, socketId: socket.id };
//       users.push(user);

//       io.emit('getUser', users); // Sending the list of active users to all connected clients
//     }

//   });

//   socket.on("sendMessage",({ senderId , message , receiverId , conversationId })=>{
//     const receiver = users.find(user=>user.userId === receiverId);
//     const sender = users.find(user=>user.userId ===  senderId);
//     if(receiver){
//       io.to(receiver.socketId).to(sender.socketId).emit('getMessage',{
//         senderId,
//         message,
//         conversationId,
//         receiverId
//       })
//     }
//   });

//   socket.on('disconnect',()=>{
//     users = users.filter(user=>user.socketId !== socket.id)
//     io.emit('getUser',users);
//   })//Disconnecting the user ( specifically from socket ... not from manin  io connection...Like when closing the tab the socket will be deleted )

// });

let users = [];

io.on('connection', (socket) => {
  console.log('User Connected', socket.id);

  // 13/9/2023
  socket.emit("me",socket.id);
  // 13/9/2023

  socket.on('addUser', (userId) => {
    const userExists = users.find((user) => user.userId === userId);

    if (userExists) {
      console.log('User already exists');
    } else {
      console.log('User added:', userId);
      const user = { userId, socketId: socket.id };
      users.push(user);
      io.emit('getUser', users); // Sending the list of active users to all connected clients
    }
  });

  // socket.on('sendMessage', ({ senderId, message, receiverId, conversationId }) => {
  //   const receiver = users.find((user) => user.userId === receiverId);
  //   const sender = users.find((user) => user.userId === senderId);

  //   if (receiver) {
  //     io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
  //       senderId,
  //       message,
  //       conversationId,
  //       receiverId,
  //     });
  //   }
  // });

  socket.on('sendMessage', ({ senderId, message, receiverId, conversationId }) => {
    const receiver = users.find((user) => user.userId === receiverId);
    const sender = users.find((user) => user.userId === senderId);

    if (receiver) {
      io.to(receiver.socketId).emit('getMessage', {
        senderId,
        message,
        conversationId,
        receiverId,
      });
    }
  });

  // 13/9/2023
  // socket.on("callUser",(data)=>{
  //   io.to(data.userToCall).emit("callUser",{signal:data.signalData , from :data.from , name:data.name});
  // })

  // socket.on("answerCall",(data)=> io.to(data.to).emit("callAccepted") , data.signal);

  // 9/13/2023
  
  socket.on('disconnect', () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit('getUser', users);
  }); // Disconnecting the user
});


PORT = 5000;
app.use("/api/auth", registerAuth);
app.use("/api/posts", postRoute);
app.use("/api/stories",storiesRoute);
app.use("/api/conversation" , conversationRoute);
app.use("/api/message" , messageRoute);
app.use("/api/group",groupRoute)

console.log("hello");

//step 5:
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));