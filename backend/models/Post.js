const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({

    userId:{
        type:Number,
        required:true,
    },

    description:{
        type:String,
        require:true,
    },
    likes : {
        type : Number,
        default:0,
        // required : true,
    },

},{timestamps : true})

module.exports = mongoose.model("Post",PostSchema);