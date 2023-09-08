const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection");
const Conversations = require("../models/Conversations");
const Messages = require("../models/Messages");

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

//Getting the conversations 
router.post("/get", async (req, res) => {
    try {
      // const {senderId} = req.params;
      const {senderId} = req.body;
  
      const conversations = await Conversations.find({members: senderId});

      const conversationUserData = await Promise.all(
        conversations.map(async (conversation) => {
          const receiverData = conversation.members.find((member) => member !== senderId);
  
          return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM users WHERE id IN (?)', [receiverData], (err, result) => {
              if (err) {
                console.error(err);
                reject(err);
              } else {
                // const dataToSend = {
                //   conversationUserData: result,
                //   conversationId: conversation._id, // Assuming _id is a property of the conversation object
                // };

                const dataToSend = { user : { username: result[0].username , email:result[0].email }  , conversationId: conversation._id,}

                resolve(dataToSend);
              }
            });
          });
        })
      );
  
      res.status(200).json(conversationUserData);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  });


  

module.exports = router;
