const mongoose = require('mongoose');


const InterestSchema = new mongoose.Schema({
    userId : {
        type : Number,
        required : true,
    },//Stores the userId who is logged in ...and the another user with whom i have done the text
    interests:{
        type:Array,
        required:true,
    }

},{timestamps : true})

module.exports = mongoose.model("Interest",InterestSchema);