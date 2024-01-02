const express = require("express");
const bodyParser = require("body-parser");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection");
const GroupMessages = require("../models/GroupMessage");
const GroupConversations = require("../models/Friend");


// router.post("/create/friend",(req,res)=>{
//     const sender = req.body.from;
//     const receiver = req.body.to;

//     try{

//         const newRequest = new GroupConversations({
//             from:sender,
//             to:receiver,
//         })

//     }catch(error){



//     }
// })