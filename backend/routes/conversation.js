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

                const dataToSend = { user : { receiverId : result[0].id , username: result[0].username , email:result[0].email }  , conversationId: conversation._id,}

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

  

  // router.get("/get/conversation/:username", async (req, res) => {

  //   const username = req.params.username;


  //   try{
  //     connection.query('SELECT id from users where username = ? ', [username], async (err, result) => {
  //       if (err) {
  //         console.error(err);
  //         return res.status(500).json({ error: 'Internal Server Error' });
  //       } else {
  //         if (result.length === 0) {
  //           // No user found with the provided username
  //           return res.status(404).json({ error: 'User not found' });
  //         }
          
  //         const conversations = await Conversations.find({members: result[0].id});

  //         console.log(conversations);
  //         if(conversations){
  //           // return res.status(200).json( user {result:result , username:username});
  //           return res.status(200).json({ user : { userId : result[0].id , username: username  }  })
  //         }

  //       }
  //     });
      
  //   }catch(error){
  //     console.log(error)
  //   }

  // })


  router.get("/get/conversation/:username", async (req, res) => {
    const username = req.params.username;
  
    try {
      connection.query('SELECT id from users where username = ? ', [username], async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        } else {
          if (result.length === 0) {
            // No user found with the provided username
            return res.status(404).json({ error: 'User not found' });
          }
  
          const conversations = await Conversations.find({ members: result[0].id });
  
          if (conversations) {
            // Construct an array with the desired format
            const responseArray = conversations.map(conversation => ({
              userId: result[0].id,
              username: username,
              // Adjust this to match your conversation schema
              // Add other properties from the conversation as needed
            }));
  
            return res.status(200).json(responseArray);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
  
  

module.exports = router;
