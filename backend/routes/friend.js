const express = require("express");
var router = express();
const bcrypt = require("bcrypt");
const FriendRequest = require("../models/Friend");
const io = require("../socket");



router.post("/create/friend", async (req,res)=>{

    const sender = req.body.from;
    const receiver = req.body.to;

    try{
        const newRequest = new FriendRequest({
            from:sender,
            to:receiver,
        })

        const request = await newRequest.save();
        
        io.emit('sendRequest',{from:sender});

        return res.status(200).send("Request Sent Successfully");

      

    }catch(error){

        res.status(500).json(error);

    }
})


// Get Details of the friend by the user id that is send by the emit from the above code .

router.post('/getRequests', async (req, res) => {
    const userId = req.body.userId;
  
    try {
      // Find friend requests where the specified user is the recipient (to)
      const friendRequests = await FriendRequest.find({ to: userId, status: 'Not Accepted' })

      res.status(200).json(friendRequests);
    } catch (error) {
        // console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Get Details of the friend by the user id that is send by the emit from the above code .

router.post('/getFriends', async (req, res) => {
  const userId = req.body.userId;

  try {
    // Find friend requests where the specified user is the recipient (to)
    const friendRequests = await FriendRequest.find({ to: userId, status: 'Accepted' })

    res.status(200).json(friendRequests);
  } catch (error) {
      // console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





module.exports = router;