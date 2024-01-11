
const express = require('express');
var router = express();
const InterestSchema = require("../models/Interests");

//API to insert interests and user id into database

router.post("/sendInterest", async (req, res) => {
    const {userId} = req.body;
    const {userInterest} = req.body;

    console.lo

    try{
        const newInterest = new InterestSchema({
            userId : userId,
            interests: userInterest,
        })

        const interest = await newInterest.save();
        return res.status(200).send({interest});
    }
    catch(error){
        res.status(500).json(error);
    }
});


module.exports=router;