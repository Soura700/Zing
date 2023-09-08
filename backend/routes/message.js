const express = require("express");
const bodyParser = require("body-parser");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection");
const Messages = require("../models/Messages");
const Conversations = require("../models/Conversations");

// router.post("/create", async (req, res) => {
//   try {
//     const { conversationId , senderId , message } = req.body;

//     const newMessage = new Messages({ conversationId , senderId , message });
//     const messages = await newMessage.save();
//     res.status(200).json(messages);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// });

router.post("/create", async (req, res) => {
    try {
      // const { conversationId , senderId , message , receiverId = '' } = req.body;

      const { conversationId , senderId , message , receiverId  } = req.body;

      // if(!conversationId) {
      //     const newConversation =  new Conversations({members:senderId})
      //     const await
      // }->Need to check later right now ok....

      if(!senderId || !message) return res.status(400).json('Please Fill all required fields');

      // if(!conversationId && receiverId){
        if(!conversationId && receiverId){

        const newConversation = new Conversations({
            members: [senderId, receiverId],
        });

        const conversation = await newConversation.save();

        const newMessage = new Messages({ conversationId:conversation._id , senderId , receiverId ,  message });
        const messages = await newMessage.save();

        return res.status(200).send('Message Sent Successfully');
      }
    //   else{
    //     return res.status(400).send('Please fill all the required fields');
    //   }
  
      const newMessage = new Messages({ conversationId , senderId , receiverId ,  message });
      const messages = await newMessage.save();
      res.status(200).json(messages);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  });


  // Getting the messages 
// router.get("/get_messages/:conversationId",async(req,res)=>{

//     try{
//         const conversationId = req.params.conversationId;
//         if(!conversationId) return res.status(400).send('Conversation Id is required')
//         // const conversationId = req.params.conversationId;
//         const messages = await Messages.find({conversationId:conversationId});
//         res.status(200).json(messages);

//     }catch(error){
//       console.log(error)
//         res.status(500).json(error);
//     }
// })

router.get("/get_messages/:conversationId", async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    // if (!conversationId) return res.status(400).send('Conversation Id is required');

    if (!conversationId) return res.status(400).json([]);

    // Fetch messages based on conversationId
    const messages = await Messages.find({ conversationId: conversationId });

    // Create an array to store user details
    const conversationUserData = [];

    // Fetch user details for each message
    for (const message of messages) {
      const senderId = message.senderId; // Assuming you have a senderId field in your message schema

      // Fetch user details for the receiverId
      const userData = await new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users WHERE id = ?', [senderId], (err, result) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            // Extract the user data you need from the result


            const user = { user:{username: result[0].username,email: result[0].email} , message: message.message };
            resolve(user);
          }
        });
      });

      conversationUserData.push(userData);
    }

    // Send the messages along with user details
    const response = {
      messages: messages,
      conversationUserData: conversationUserData,
    };

    // res.status(200).json(response);
    res.status(200).json(conversationUserData)
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});



module.exports = router;
