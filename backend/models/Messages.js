const mongoose = require('mongoose');


const MessageSchema = new mongoose.Schema({
    conversationId : {
        type : mongoose.Schema.Types.ObjectId,
        // required : true,
    },//Stores the userId who is logged in ...and the another user with whom i have done the text
    senderId:{
        type:Number
    },
    receiverId:{
        type:Number
    },
    message:{
        type:String,
    }

},{timestamps : true})
module.exports = mongoose.model("Message",MessageSchema);