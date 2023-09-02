const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection");
const Conversations = require("../models/Conversations");

router.post("/create/conversation", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const newConversation = new Conversations({
      members: [senderId, receiverId],
    });
    const conversation = await newConversation.save();
    res.status(200).json(conversation);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});


router.get("/get", async (req, res) => {
  try {
    const senderId = req.body.senderId;

    const conversations = await Conversations.find({
      members: senderId,
    });

    const converSationUserData = conversations.map( async (conversation) => {
      const receiverData = conversation.members.find((members) =>  members !== senderId );

      connection.query('SELECT * FROM users WHERE id IN (?)',(err,result)=>{
        if(err){
            return res.status(500).json(err)
            console.log(err)
        }
        else{
            // return res.status(200).json(result);
            return result;
        }
      })
    });

    // res.status(200).json(conversations);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
