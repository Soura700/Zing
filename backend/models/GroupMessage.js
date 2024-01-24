const mongoose = require('mongoose');


const GroupMessage = new mongoose.Schema({
    conversationId : {
        type : mongoose.Schema.Types.ObjectId,
        // required : true,
        ref:'GroupConversation'
    },
    senderId : {
        type : Number,
        // required : true,
    },//Stores the userId who is logged in ...and the another user with whom i have done the text
    group_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group'
    },
    message:{
        type:String,
    }

},{timestamps : true})
module.exports = mongoose.model("GroupMessage",GroupMessage);