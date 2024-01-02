const express = require("express");
var router = express();
const bcrypt = require("bcrypt");
const FriendRequest = require("../models/Friend");
const io = require("../socket");



router.post("/create/friend",(req,res)=>{

    const sender = req.body.from;
    const receiver = req.body.to;

    try{
        const newRequest = new FriendRequest({
            from:sender,
            to:receiver,
        })

        const request = newRequest.save();
        return res.status(200).send("Request Sent Successfully");

        io.emit('sendRequest',{from:sender});

    }catch(error){

        res.status(500).json(error);

    }
})

module.exports = router;