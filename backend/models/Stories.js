const mongoose = require('mongoose');


const StorySchema = new mongoose.Schema({
    // userId : {
    //     type : Number,
    //     //type : mongoose.Schema.Types.ObjectId,
    //     required : true,
    //     //ref : 'users',
    // },

    // userName : {
    //     type : String,
    //     required : true,
    // },

    views : {
        type : Number,
        default : 0,
    },

    mediaType: {
        type: String,
        enum: ['photo', 'video'],
        //required: true,
    },

    contentUrl : {
        type : String,
        //required : true,
    },

    expiry_time : {
        type : Date,
        default : null,
    },

},{timestamps : true})
module.exports = mongoose.model("Story",StorySchema);