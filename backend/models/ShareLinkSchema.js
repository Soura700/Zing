const mongoose = require('mongoose');

const ShareLinkSchema = new mongoose.Schema({

    postId:{
        type:Number,
        required:true,
    },
    shareLink:{
        type:String,
        required:true
    }

},{timestamps : true})

module.exports = mongoose.model("Sharelinks",ShareLinkSchema);