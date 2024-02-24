const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const cors = require("cors");
var connection = require("./connection");
var registerAuth = require("./routes/auth");
var postRoute = require("./routes/post");
const storiesRoute = require("./routes/stories");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");
const groupRoute = require("./routes/group");
const groupMessageRoute = require("./routes/groupmessage");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const friendRequestRoute = require("./routes/friend");
const friend_Request_Route = require("./routes/friend2");
const suggestion = require("./routes/suggestion");
var googleregisterAuth = require("./routes/googleauth");
// const suggestion2 = require("./routes/suggestion2");
const personalization = require("./routes/personalization");
const interests_route = require("./routes/interest");
const unread_message_route = require("./routes/unreadmessages");
const fof = require("./routes/suggestion");
const commentRoute = require("./routes/comment");
const settingRoute = require("./routes/settings");
const path = require("path");
const bodyParser = require("body-parser");
// const io = require("./socket");
app.set("view engine", "ejs");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
}).listen(5500);

const { ExpressPeerServer } = require("peer");
const opinions = {
  debug: true,
};

app.use("/peerjs", ExpressPeerServer(server, opinions));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));

app.use(
  cors({
    origin: "https://zing-five.vercel.app",
    // origin: "https://zing-qb6s.onrender.com",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);




// Set middleware of CORS 
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://zing-five.vercel.app"
    // "https://zing-qb6s.onrender.com"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});

dotenv.config();
// Step 2:
app.use(express.json());
//step 3:
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
    return;
  }

  console.log("Connected to the database");

  // const createTableQuery = `
  // CREATE TABLE users (
  //   id int UNSIGNED NOT NULL primary key auto_increment,
  //   username varchar(1000) NOT NULL,
  //   email varchar(500) NOT NULL,
  //   user_password varchar(1000) NOT NULL,
  //   isAdmin int DEFAULT '0',
  //   userstatus int DEFAULT '0' COMMENT '0=logout 1=login 2=blocked',
  //   lastonline timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  //   profileImg varchar(1000) DEFAULT NULL,
  //   coverImg varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'cover image path store',
  //   bio varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'bio store',
  //   ip_addresses varchar(1000) DEFAULT NULL,
  //   createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  //   updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  // );`

  //   const createTableQuery = `
  // // CREATE TABLE posts (
  // //   id int NOT NULL primary key auto_increment,
  // //   userId int UNSIGNED NOT NULL,
  // //   description varchar(500) DEFAULT NULL,
  // //   image varchar(255) DEFAULT NULL,
  // //   createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  // //   updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  // //   username varchar(250) DEFAULT NULL,
  // //   likes int NOT NULL DEFAULT 0
  // // )`;

  // const createTableQuery = `
  // CREATE TABLE post_likes (
  //   id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  //   post_id int DEFAULT NULL,
  //   user_id int UNSIGNED DEFAULT NULL,
  //   created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP
  // ) ;`

  // connection.query(createTableQuery, (err, results, fields) => {
  //   if (err) {
  //     console.error("Error creating table: ", err.stack);
  //     return;
  //   }

  //   console.log("Table created successfully");
  // });

  // const dropTableQuery = `DROP TABLE IF EXISTS post_likes`;

  // connection.query(dropTableQuery, (err, results, fields) => {
  //   if (err) {
  //     console.error("Error dropping table: ", err.stack);
  //     return;
  //   }

  //   console.log("Table dropped successfully");
  // });
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

(async () => {
  var neo4j = require("neo4j-driver");

  // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
  const URI = "neo4j+s://78208b1f.databases.neo4j.io";
  const USER = "neo4j";
  const PASSWORD = "7Ip5WHgdheXTisuYy9VB959wyzzbXzYkuTjCbQWviN8";
  let driver;

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    const serverInfo = await driver.getServerInfo();
    console.log("Connection estabilished");
    console.log(serverInfo);
  } catch (err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`);
    await driver.close();
    return;
  }

  // Use the driver to run queries

  await driver.close();
})();

let users = [];
const activeGroups = [];

io.on("connection", (socket) => {
  // 13/9/2023
  socket.emit("me", socket.id);
  // 13/9/2023

  socket.on("addUser", (userId) => {
    const userExists = users.find((user) => user.userId === userId);

    if (userExists) {
      console.log("User already exists");
    } else {
      console.log("User added:", userId);
      const user = { userId, socketId: socket.id };
      users.push(user);
      io.emit("getUser", users); // Sending the list of active users to all connected clients
    }
  });

  socket.on(
    "sendMessage",
    ({ senderId, message, receiverId, conversationId }) => {
      const receiver = users.find((user) => user.userId === receiverId);
      const sender = users.find((user) => user.userId === senderId);

      if (receiver) {
        io.to(receiver.socketId).emit("getMessage", {
          senderId,
          message,
          conversationId,
          receiverId,
        });
      }
    }
  );

  // 21/9/2023

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room" + room);
  });

  socket.on(
    "sendGroupMessage",
    ({ senderId, message, conversationId, group_id }) => {
      socket.to(group_id).emit("groupMessage", { senderId, message });
    }
  );

  socket.on("onlineUsers", (users) => {
    io.emit("showOnlinUsers", users);
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUser", users);
  }); // Disconnecting the user
});

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    // console.log("User disconnected:", socket.id);
  });

  socket.on("callUser", (data) => {
    const targetSocket = data.userToCall;
    if (targetSocket) {
      io.emit("incomingCall", {
        signal: data.signalData,
        from: data.from,
      });
    } else {
      console.log("Invalid target socket:", data.userToCall);
      // Handle the case when the target socket is not valid
    }
  });

  socket.on("answerCall", (data) => {
    // console.log("Answering Call to:", data.to);
    const targetSocket = data.to;
    if (targetSocket) {
      io.emit("callAccepted", {
        signal: data.signal, // Wrap the signal in an object
      });
    } else {
      console.log("Invalid target socket:", data.to);
      // Handle the case when the target socket is not valid
    }
  });


  socket.on("initiateCall", (data) => {
    const receiverSocket = data.receiverId;
    if (receiverSocket) {
      // Notify the receiver about the incoming call
      io.emit("incomingCallAlert", { callerId: data.callerId });
    }
  });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    setTimeout(() => {
      socket.to(roomId).emit("user-connected", userId);
    }, 1000);
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
    socket.on("call-ended", () => {
      // Broadcast "call-ended" event to all other users in the room
      socket.broadcast.emit("call-ended", userId);
    });
  });
  socket.on("initiateGroupCall", ({ groupid, callerId }) => {
    // Broadcast the call initiation message to all participants in the room
    // io.to(groupId).emit("incomingGroupCallAlert", { callerId });
    // socket.to(groupId).emit("incomingGroupCallAlert", { callerId });
    socket.to(groupid).emit("incomingGroupCallAlert", { callerId, groupid });
  });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

PORT = 5000;
app.use("/", googleregisterAuth);
app.use("/api/auth", registerAuth);
app.use("/api/posts", postRoute);
app.use("/api/stories", storiesRoute);
app.use("/api/conversation", conversationRoute);
app.use("/api/message", messageRoute);
app.use("/api/group", groupRoute);
app.use("/api/groupmessage", groupMessageRoute);
app.use("/api/friendrequest", friendRequestRoute);
app.use("/api/friend_request", friend_Request_Route);
app.use("/api", fof);
app.use("/api/user", interests_route);

app.use("/bio_profile_img", personalization);
app.use("/api/bio_profile_img", personalization);
app.use("/api/get", unread_message_route);
// console.log(suggestion2);
// suggestion2;
app.use("/api/settings",settingRoute)
app.use("/api/comment", commentRoute); //  01/02/2024
console.log("hello");

//step 5:
// app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));


// Release MySQL connection
// connection.end((err) => {
//   if (err) {
//     console.error("Error releasing MySQL connection: ", err);
//     return;
//   }
//   console.log("MySQL connection released");
// });



server.listen(process.env.PORT || 5000);
module.exports = {
  io: io,
};
