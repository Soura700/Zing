const cors = require("cors");

const io = require("socket.io")(5500,{
    cors:{
      origin:'http://localhost:3000'
    }
  });

  module.exports = io;