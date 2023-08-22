// create stories
const Stories = require('../models/Stories');
const mongoose = require('mongoose');
const { request } = require('./auth');
var router = require('express').Router();

router.post("/create_stories", async (req,res) => {
    const userId = req.body.userId;
    
    try{
        const newStories = new Stories({
            userId : req.body.userId,
            userName : req.body.userName,
        })
        const stories = await newStories.save()
        res.status(200).json(stories);
    }

    catch(error){
        console.log(error);
        res.status(500).json(error);
    }
})
module.exports = router;