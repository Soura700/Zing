const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    groupName:{
        type:String,
        required:true,
    },
    group_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group'
    },
    members : {
        type : Array,
        required : true,
    },//Stores the userId who is logged in ...and the another user with whom i have done the text

},{timestamps : true})

module.exports = mongoose.model("GroupConversation",GroupSchema);