const express = require("express");
const app = express();
const server = require("http").Server(app);
const cors = require("cors");
const socketIO = require("socket.io");

// const io = socketIO(server, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

const io = require("socket.io")(server,{
  cors:{
    origin:'http://localhost:3000'
  }
}).listen(8000);

// module.exports = io;

// const io = require("socket.io")(server,{
//     cors:{
//       origin:'http://localhost:3000',
//     }
//   }).listen(5500);

  module.exports = io;
