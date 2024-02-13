const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection");
const io = require("../socket");
const Group = require("../models/GroupChat");

router.post("/create", async (req, res) => {
  try {
    const { admin, members, groupName } = req.body;
    const newGroup = new Group({
      groupName: groupName,
      members: members,
      groupAdmin: admin,
    });
    const group = await newGroup.save();
    members.forEach((member) => {
      io.emit("showCreatedGroup", {group:newGroup , member:member});
    });
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
    console.error("Error retrieving groups:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Find the groups by userId
router.get("/groups/:user", async (req, res) => {
  const user = req.params.user;
  const userId = parseInt(user);
  console.log(typeof userId);

  try {
    // Use Mongoose to find groups where the user's ID is in the members array
    const groups = await Group.find({ members: userId });

    // Return the list of groups as a JSON response
    res.status(200).json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Group Members

router.get("/get_group_members", async (req, res) => {
  try {
    let groupid = req.query.groupId;
    if (!groupid) {
      return res.status(400).json({ msg: "Group Not Find" });
    } else {
      const group = await Group.findOne({ _id: groupid }).populate("members");
      const members = group.members;
      const fetchUserPromises = members.map((member) => {
        console.log("Members");
        console.log(member);
        return new Promise((resolve, reject) => {
          const userQuery = `SELECT * FROM users WHERE id = ?`;
          connection.query(userQuery, [member], (error, userData) => {
            if (error) {
              reject(error);
            } else {
              resolve({  user: userData[0] });
            }
          });
        });
      });
      const populatedMembers = await Promise.all(fetchUserPromises);
      return res.status(200).json(populatedMembers);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});


router.get("/search-suggestions", async (req, res) => {
  try {
    // Extract the search query from the request query parameters
    const { query } = req.query;    
    // Find groups matching the search query using regex for partial matching
    const groups = await Group.find({ groupName: { $regex: query, $options: 'i' } });
    return res.status(200).json(groups);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.post("/leave", async (req, res) => {
  try {
    const { groupId, memberId } = req.body;

    // Find the group by ID
    const group = await Group.findById(groupId);

    // Check if the group exists
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if the member is part of the group
    const memberIndex = group.members.indexOf(memberId);
    if (memberIndex === -1) {
      return res
        .status(400)
        .json({ message: "Member is not part of the group" });
    }

    // Remove the member from the group
    group.members.splice(memberIndex, 1);

    io.emit("memberLeft", {groupid:groupId,memberId:memberId});


    // Save the updated group
    const updatedGroup = await group.save();

    // Emit socket event to notify the member
    // io.emit("groupLeft", {groupId:groupId, userID:memberId});

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/add-members", async (req, res) => {
  try {
    const { groupId, newMembers } = req.body;

    // Find the group by ID
    const group = await Group.findById(groupId);

    // Check if the group exists
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Add new members to the group
    group.members.push(...newMembers);

    // Save the updated group
    const updatedGroup = await group.save();

    // Emit socket event to notify all members of the group about the new members
    newMembers.forEach((member) => {
      io.to(member).emit("memberAddedToGroup", { groupId, newMembers });
    });

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});




module.exports = router;
