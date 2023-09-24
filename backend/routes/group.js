const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection");
const Group = require("../models/GroupChat")


router.post("/create", async (req, res) => {
    try {
      const { admin, members , groupName } = req.body;
      const newGroup = new Group({
        groupName:groupName,
        members: members ,
        groupAdmin:admin
      });
      const group = await newGroup.save();
      res.status(200).json(group);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  });


  // router.post("/get", async (req, res) => {
  //   try {
  //   //   const { admin, members , groupName } = req.body;
  //   //   const newGroup = new Group({
  //   //     groupName:groupName,
  //   //     members: [ members ],
  //   //     groupAdmin:[admin]
  //   //   });
  //     const group = await newGroup.save();
  //     res.status(200).json(group);
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json(error);
  //   }
  // });


  router.get("/all_groups", async (req, res) => {
    try {
      const groups = await Group.find({}); // Retrieve all groups from the MongoDB collection
      res.status(200).json(groups); // Send the groups as a JSON response
    } catch (error) {
      console.error('Error retrieving groups:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  // Find the groups by userId
  router.get("/groups/:user", async (req, res) => {
    const user = req.params.user;
    // const userId = req.body.userId;
    const userId = parseInt(user);
    // console.log(typeof userId);
    // console.log(userId);
    // console.log(typeof user);
    console.log(typeof userId);

  
    try {
      // Use Mongoose to find groups where the user's ID is in the members array
      const groups = await Group.find({ members: userId });
  
      // Return the list of groups as a JSON response
      res.status(200).json( groups );
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


module.exports = router;