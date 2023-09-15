const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({


      groupName:{
        type:String,
        required:true
      },
      
    members : {
        type : Array,
        required : true,
    },
    //Stores the userId who is logged in ...and the another user with whom i have done the text

    groupAdmin:{
      type: Array,
      required:true
    },

},{timestamps : true})

module.exports = mongoose.model("Group",GroupSchema);