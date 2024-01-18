const mongoose = require('mongoose');


const UnreadMessageSchema = new mongoose.Schema({
    senderId:{
        type:Number
    },
    senderName:{
        type:String
    },
    receiverId:{
        type:Number
    },
    receiverName:{
        type:String
    },
    message:{
        type:String,
    },
    message_type:{
        type:String
    }

},{timestamps : true})
module.exports = mongoose.model("UnreadMessage",UnreadMessageSchema);