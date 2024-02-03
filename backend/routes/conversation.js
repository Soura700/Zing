const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection");
const Conversations = require("../models/Conversations");
const Messages = require("../models/Messages");
const GroupConversation = require("../models/GroupConversation");

// Creating teh conversations
router.post("/create/conversation", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const newConversation = new Conversations({
      members: [senderId, receiverId],
    });
    const conversation = await newConversation.save();
    res.status(200).json(conversation);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//Getting the conversations
router.post("/get", async (req, res) => {
  try {
    // const {senderId} = req.params;
    const { senderId } = req.body;

    const conversations = await Conversations.find({ members: senderId });

    const conversationUserData = await Promise.all(
      conversations.map(async (conversation) => {
        const receiverData = conversation.members.find(
          (member) => member !== senderId
        );

        return new Promise((resolve, reject) => {
          connection.query(
            "SELECT * FROM users WHERE id IN (?)",
            [receiverData],
            (err, result) => {
              if (err) {
                console.error(err);
                reject(err);
              } else {
                // const dataToSend = {
                //   conversationUserData: result,
                //   conversationId: conversation._id, // Assuming _id is a property of the conversation object
                // };

                const dataToSend = {
                  user: {
                    receiverId: result[0]?.id,
                    username: result[0]?.username,
                    email: result[0]?.email,
                  },
                  conversationId: conversation?._id,
                };

                resolve(dataToSend);
              }
            }
          );
        });
      })
    );

    res.status(200).json(conversationUserData);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// Get Conversation by senderId and the receiverId

router.post("/getConversation_by_sender_receiverId", async (req, res) => {
  try {
    // const {senderId} = req.params;
    const { senderId } = req.body;

    const { receiverId } = req.body;

    const conversations = await Conversations.find({
      members: {
        $all: [senderId, receiverId],
      },
    });

    const conversationUserData = await Promise.all(
      conversations.map(async (conversation) => {
        const receiverData = conversation.members.find(
          (member) => member !== senderId
        );

        return new Promise((resolve, reject) => {
          connection.query(
            "SELECT * FROM users WHERE id IN (?)",
            [receiverData],
            (err, result) => {
              if (err) {
                console.error(err);
                reject(err);
              } else {
                // const dataToSend = {
                //   conversationUserData: result,
                //   conversationId: conversation._id, // Assuming _id is a property of the conversation object
                // };

                const dataToSend = {
                  user: {
                    receiverId: result[0]?.id,
                    username: result[0]?.username,
                    email: result[0]?.email,
                  },
                  conversationId: conversation?._id,
                };

                resolve(dataToSend);
              }
            }
          );
        });
      })
    );

    res.status(200).json(conversationUserData);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// router.get("/get/conversation/:username", async (req, res) => {

//   const username = req.params.username;

//   try{
//     connection.query('SELECT id from users where username = ? ', [username], async (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Internal Server Error' });
//       } else {
//         if (result.length === 0) {
//           // No user found with the provided username
//           return res.status(404).json({ error: 'User not found' });
//         }

//         const conversations = await Conversations.find({members: result[0].id});

//         console.log(conversations);
//         if(conversations){
//           // return res.status(200).json( user {result:result , username:username});
//           return res.status(200).json({ user : { userId : result[0].id , username: username  }  })
//         }

//       }
//     });

//   }catch(error){
//     console.log(error)
//   }

// })

router.post("/get/conversation/:username", async (req, res) => {
  const username = req.params.username;
  const searcherId = req.body.userId;

  try {
    connection.query(
      "SELECT id from users where username = ? ",
      [username],
      async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal Server Error" });
        } else {
          if (result.length === 0) {
            // No user found with the provided username
            return res.status(404).json({ error: "User not found" });
          }

          const conversations = await Conversations.find({
            members: {
              $all: [result[0].id, searcherId],
            },
          });

          // const conversations = await Conversations.find({ members: result[0].id });

          console.log(conversations.length);
          console.log("Conversationssssssssssss");

          if (conversations.length != 0) {
            // Construct an array with the desired format
            const responseArray = conversations.map((conversation) => ({
              userId: result[0].id,
              username: username,
              // Adjust this to match your conversation schema
              // Add other properties from the conversation as needed
            }));
            return res.status(200).json(responseArray);
          } else {
            return res.status(404).json({ error: "Conversation not found" });
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// Creating group conversations
// router.post("/create/group/conversation", async (req, res) => {
//   try {
//     const { senderId, receiverId } = req.body;
//     const newConversation = new Conversations({
//       members: [senderId, receiverId],
//     });
//     const conversation = await newConversation.save();
//     res.status(200).json(conversation);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// });

router.post("/create/group/conversation", async (req, res) => {
  try {
    const { memberIds } = req.body;
    const { groupName } = req.body;
    const { group_id } = req.body;
    const newConversation = new GroupConversation({
      groupName: groupName,
      group_id: group_id,
      members: memberIds,
    });
    const conversation = await newConversation.save();
    res.status(200).json(conversation);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/get_group_id/conversation", async (req, res) => {
  try {
    const { group_id } = req.body;
    const conversation = await GroupConversation.findOne({
      group_id: group_id,
    });
    console.log(conversation._id);
    res.status(200).json(conversation);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});


//leave group (03/02/2024)
router.post("/leave/group/conversation", async (req, res) => {
  try {
    const { memberId, conversationId } = req.body;

    // Find the group conversation by ID
    const groupConversation = await GroupConversation.findById(conversationId);

    // Check if the conversation exists
    if (!groupConversation) {
      return res.status(404).json({ message: "Group conversation not found" });
    }

    // Check if the member is part of the conversation
    const memberIndex = groupConversation.members.indexOf(memberId);
    if (memberIndex === -1) {
      return res.status(400).json({ message: "Member is not part of the conversation" });
    }

    // Remove the member from the conversation
    groupConversation.members.splice(memberIndex, 1);

    // Save the updated conversation
    const updatedConversation = await groupConversation.save();

    res.status(200).json(updatedConversation);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
    
// router.post("/block",async(req,res)=>{
//   const {conversationId,userIdToBlock} = req.body;
//   try{

//   const conversation = await  Conversations.findById(conversationId);

//   if(!conversation){
//     return res.status(400).json({error:'Conversation Not Found'});
//   }
//   if(conversation.blockedUser.includes(userIdToBlock)){
//     return res.status(400).json({error:'User Already Blocked'});
//   }

//   conversation.blockedUser.push(userIdToBlock);
//   await conversation.save();

//   return res.status(200).json({message:'User Blocked Successfully'});
//   }catch(error){
//     console.log("Error in blocking user : ", error);
//     return res.status(500).json(error);
//   }
// })

// API endpoint to block a user
router.post("/block", async (req, res) => {
  try {
    // Extract data from request body
    const { conversationId, userIdToBlock } = req.body;

    // Find the conversation document by its ID
    const conversation = await Conversations.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Check if blockedUsers array exists in the conversation document
    if (!conversation.blockedUser) {
      conversation.blockedUser = []; // Initialize the blockedUsers array if it doesn't exist
    }

    // Check if the user is already blocked
    let isUserBlocked = false;
    for (const blockedUser of conversation.blockedUser) {
      if (blockedUser === userIdToBlock) {
        isUserBlocked = true;
        break;
      }
    }

    if (isUserBlocked) {
      return res.status(400).json({ error: "User already blocked" });
    }

    // Add the user to the blockedUsers array
    conversation.blockedUser.push(userIdToBlock);

    // Save the updated conversation document
    await conversation.save();

    return res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
