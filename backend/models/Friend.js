const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({

    from:{
        type : Number,
        required : true,
    },
    to:{
        type : Number,
        required : true,
    },
    status:{
        type : String,
        default:'Not Accepted'
    }

},{timestamps : true})

module.exports = mongoose.model("Friend",FriendSchema);