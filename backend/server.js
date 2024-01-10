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
const groupMessageRoute = require("./routes/groupmessage");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const friendRequestRoute = require("./routes/friend");
const friend_Request_Route = require("./routes/friend2");
const io = require("./socket");
const suggestion = require("./routes/suggestion"); 
const suggestion2 = require("./routes/suggestion2"); 
const personalization = require("./routes/personalization");

const fof = require("./routes/suggestion"); 

// const io = require("socket.io")(5500,{
//   cors:{
//     origin:'http://localhost:3000'
//   }
// });

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



  (async () => {
    var neo4j = require('neo4j-driver')
  
    // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
    const URI = 'neo4j+s://78208b1f.databases.neo4j.io'
    const USER = 'neo4j'
    const PASSWORD = '7Ip5WHgdheXTisuYy9VB959wyzzbXzYkuTjCbQWviN8'
    let driver
  
    try {
      driver = neo4j.driver(URI,  neo4j.auth.basic(USER, PASSWORD))
      const serverInfo = await driver.getServerInfo()
      console.log('Connection estabilished')
      console.log(serverInfo)
    } catch(err) {
      console.log(`Connection error\n${err}\nCause: ${err.cause}`)
      await driver.close()
      return
    }
  
    // Use the driver to run queries
  
    await driver.close()
  })();

let users = [];
const activeGroups = [];

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

  // 21/9/2023



  socket.on("join chat" , (room) =>{
    socket.join(room);
    console.log("User Joined Room" + room);
  })


  socket.on("sendGroupMessage" , ( {senderId , message ,  conversationId , group_id })=>{
    console.log(group_id + message + conversationId + senderId);
    io.emit('groupMessage' , { senderId , message });
  })

  // // 27/09/2023

  // socket.on('callUser', ({ signalData, callerId }) => {
  //   // Emit this event to the specific user (callerId) or broadcast it to all users
  //   // You can emit this event to the caller and provide the signal data for the call
  //   // Example: 
  //   io.to(callerId).emit('incomingCall', { signalData });
  // })

  // socket.on('callUser', ({ receiverId }) => {
  //   // Find the receiver's socket by ID
  //   // const receiverSocket = /* Logic to find the receiver's socket by ID */;

  //   console.log(receiverId);

  //   const receiverSocket = users.find(user => user.userId === receiverId);


  //   if (receiverSocket) {
  //     // Emit an "incomingCall" event to the receiver's socket
  //     io.emit('incomingCall', { callerId: socket.id });
  //   }
  //   else {
  //     // Handle the case where the receiver with the specified ID is not found
  //     console.log(`Receiver with ID ${receiverId} not found.`);
  //     // You can emit an error event or take appropriate action here
  //   }

  // });

  socket.on('callUser', ({ receiverId, isVideoCall }) => {
    const receiverSocketId = connectedUsers[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('incomingCall', {
        callerId: socket.id,
        isVideoCall,
      });
    }
  });

  // Event to handle sending the offer signal
  socket.on('sendOfferSignal', ({ signalData, receiverId, isVideoCall }) => {
    const receiverSocketId = connectedUsers[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveOfferSignal', {
        signalData,
        callerId: socket.id,
        isVideoCall,
      });
    }
  });


    // Event to handle sending the answer signal
    socket.on('sendAnswerSignal', ({ signalData, callerId }) => {
      io.to(callerId).emit('receiveAnswerSignal', {
        signalData,
        receiverId: socket.id,
      });
    });


    socket.on('offer', (data) => {
      socket.to(data.target).emit('offer', data);
    });
  
    socket.on('answer', (data) => {
      socket.to(data.target).emit('answer', data);
    });
  
    socket.on('ice-candidate', (data) => {
      socket.to(data.target).emit('ice-candidate', data.candidate);
    });



    



  
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
app.use("/api/group",groupRoute);
app.use("/api/groupmessage",groupMessageRoute);
app.use("/api/friendrequest",friendRequestRoute);
app.use("/api/friend_request" , friend_Request_Route)
app.use("/api" , fof)
app.use("/api/bio_profile_img" , personalization)


// console.log(suggestion2);

// suggestion2;

console.log("hello");

//step 5:
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));



