const mongoose = require("mongoose");



const chatModel = mongoose.Schema(

    {
      members : {
        type : Array,
        required : true,
    },
      groupAdmin: Array,
      required:true
    },
    { timestamps: true }

  );
const Chat = mongoose.model("Chat", chatModel);
module.exports = Chat;