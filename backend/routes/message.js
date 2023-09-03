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
      const { conversationId , senderId , message , receiverId = '' } = req.body;

      if(!senderId || !message) return res.status(400).json('Please Fill all required fields');

      if(!conversationId && receiverId){

        const newConversation = new Conversations({
            members: [senderId, receiverId],
        });

        const conversation = await newConversation.save();

        const newMessage = new Messages({ conversationId , senderId , message });
        const messages = await newMessage.save();

        return res.status(200).send('Message Sent Successfully');
      }
    //   else{
    //     return res.status(400).send('Please fill all the required fields');
    //   }
  
      const newMessage = new Messages({ conversationId , senderId , message });
      const messages = await newMessage.save();
      res.status(200).json(messages);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  });

router.get("/get_messages/:conversationId",async(req,res)=>{

    try{
        const conversationId = req.params.conversationId;
        if(!conversationId) return res.status(400).send('Conversation Id is required')
        // const conversationId = req.params.conversationId;
        const messages = await Messages.find({conversationId:conversationId});
        res.status(200).json(messages);

    }catch(error){
      console.log(error)
        res.status(500).json(error);
    }
})


module.exports = router;
