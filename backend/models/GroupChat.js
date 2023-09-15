// const mongoose = require("mongoose");



// const GroupSchema = mongoose.Schema({
//       groupName:{
//         type:String,
//         require:true
//       },
//       members : {
//         type : Array,
//         required : true,
//     },
//       groupAdmin: Array,
//       require:true
//     },
//     { timestamps: true }

//   );
//   module.exports = mongoose.model("Group",GroupSchema);


const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
      groupName:{
        type:String,
        require:true
      },
    members : {
        type : Array,
        required : true,
    },//Stores the userId who is logged in ...and the another user with whom i have done the text
    groupAdmin:{
      type: Array,
      require:true
    },

},{timestamps : true})

module.exports = mongoose.model("Group",GroupSchema);