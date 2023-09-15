const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection");
const Group = require("../models/GroupChat")


router.post("/create", async (req, res) => {
    try {
      const { admin, members } = req.body;
      const newGroup = new Group({
        members: [ members ],
        groupAdmin:[admin]
      });
      const group = await newGroup.save();
      res.status(200).json(group);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  });


module.exports = router;