const express = require('express');
const UnreadMessages = require('../models/UnreadMessages');
var router = express();

router.get("/get_unread_friend_message/:userId", async (req,res)=>{
    const userId = req.params.userId;

  
    try {
      // Find unread_message  where the specified user is the recipient (to)
      const unread_messages = await UnreadMessages.find({ receiverId: userId, message_type: 'Friend Request' })
  
      res.status(200).json(unread_messages);
    } catch (error) {
        // console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  
router.get("/get_unread_message/:userId", async (req,res)=>{
  const userId = req.params.userId;


  try {
    // Find unread_message  where the specified user is the recipient (to)
    const unread_messages = await UnreadMessages.find({ receiverId: userId, $or:[ {message_type: 'Declined'} , {message_type:'Accept'} ] })

    res.status(200).json(unread_messages);
  } catch (error) {
      // console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


  router.delete("/delete_unread_friend_message/:userId", async (req,res)=>{
    const userId = req.params.userId;
    try {
      // Find unread_message  where the specified user is the recipient (to)
      const unread_messages = await UnreadMessages.deleteMany({ receiverId: userId, message_type: 'Friend Request' })
  
      res.status(200).json(unread_messages);
    } catch (error) {
        // console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;