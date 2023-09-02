const express = require("express");
const bodyParser = require("body-parser");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection");
const Messages = require("../models/Messages");

router.post("/create", async (req, res) => {
  try {
    const { conversationId , senderId , message } = req.body;

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
        const messages = await Messages.find({conversationId:conversationId});
        res.status(200).json(messages);

    }catch(error){
        res.status(500).json(error);
    }

})


module.exports = router;
