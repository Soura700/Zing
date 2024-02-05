const express = require("express");
const bodyParser = require("body-parser");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection");
const GroupMessages = require("../models/GroupMessage");
const GroupConversations = require("../models/GroupConversation");

// router.post("/group/message_create", async (req, res) => {
//     try {
//       // const { conversationId , senderId , message , receiverId = '' } = req.body;

//     //   const { conversationId , senderId , message , receiverId  } = req.body;

//     const { conversationId ,  message , senderId  } = req.body;
//     const { memberIds } = req.body;

//       // if(!conversationId) {
//       //     const newConversation =  new Conversations({members:senderId})
//       //     const await
//       // }->Need to check later right now ok....

//       if(!senderId || !message) return res.status(400).json('Please Fill all required fields');

//       // if(!conversationId && receiverId){
//         if(!conversationId && receiverId){

//         const newConversation = new GroupConversations({
//             members: [memberIds],
//         });

//         const conversation = await newConversation.save();

//         const newMessage = new GroupMessages({ conversationId:conversation._id , senderId:senderId ,  message:message });
//         const messages = await newMessage.save();

//         return res.status(200).send('Message Sent Successfully');
//       }
//     //   else{
//     //     return res.status(400).send('Please fill all the required fields');
//     //   }

//       const newMessage = new GroupMessages({ conversationId , senderId ,  message });
//       const messages = await newMessage.save();
//       res.status(200).json(messages);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json(error);
//     }
//   });


router.post("/group/message_create", async (req, res) => {
  try {
    const { conversationId, message, senderId, group_id , groupName} = req.body;
    const { memberIds } = req.body;

    if (!senderId || !message || !group_id) {
      return res.status(400).json("Please Fill all required fields");
    }

    if (!conversationId) {
      const newConversation = new GroupConversations({
        groupName:groupName,
        members: [memberIds],
        group_id:group_id
      });

      const conversation = await newConversation.save();

      const newMessage = new GroupMessages({
        conversationId: conversation._id,
        senderId: senderId,
        message: message,
        group_id: group_id, // Associate the group_id with the message
      });

      const messages = await newMessage.save();

      return res.status(200).send("Message Sent Successfully");
    } else {
      const newMessage = new GroupMessages({
        conversationId,
        senderId,
        message,
        group_id: group_id, // Associate the group_id with the message
      });

      const messages = await newMessage.save();
      res.status(200).json(messages);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Old api to get the message by conversation id

// router.get("/get_group_messages/:conversationId", async (req, res) => {
//   try {
//     const conversationId = req.params.conversationId;
//     // if (!conversationId) return res.status(400).send('Conversation Id is required');

//     if (!conversationId) return res.status(400).json([]);

//     // Fetch messages based on conversationId
//     const messages = await GroupMessages.find({ conversationId: conversationId });

//     // Create an array to store user details
//     const conversationUserData = [];

//     // Fetch user details for each message
//     for (const message of messages) {
//       const senderId = message.senderId; // Assuming you have a senderId field in your message schema

//       // Fetch user details for the receiverId
//       const userData = await new Promise((resolve, reject) => {
//         connection.query('SELECT * FROM users WHERE id = ?', [senderId], (err, result) => {
//           if (err) {
//             console.error(err);
//             reject(err);
//           } else {
//             // Extract the user data you need from the result

//             const user = { user:{ id: result[0].id ,  username: result[0].username,email: result[0].email} , message: message.message };
//             // const user = { message: message.message };

//             resolve(user);
//           }
//         });
//       });

//       conversationUserData.push(userData);
//     }

//     // Send the messages along with user details
//     const response = {
//       messages: messages,
//       conversationUserData: conversationUserData,
//     };

//     // res.status(200).json(response);
//     res.status(200).json(conversationUserData)
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// });

// router.get("/group/messages/:group_id", async (req, res) => {
//   try {
//     const { group_id } = req.params;

//     // Find messages that belong to the specified group_id
//     const messages = await GroupMessages.find({ group_id });

//     if (!messages) {
//       return res.status(404).json("No messages found for this group.");
//     }

//     res.status(200).json(messages);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json(error);
//   }
// });



// Define a route to get group messages by conversationId or group_id
// router.get("/get_group_messages/:conversationOrGroupId", async (req, res) => {
router.get("/get_group_messages/:groupId", async (req, res) => {
try {
    // const { conversationOrGroupId } = req.params;
    const { groupId } = req.params; // Get the optional group_id from the query string

    let messages;

    if (groupId) {
      // If a groupId is provided in the query, fetch messages by group_id
      messages = await GroupMessages.find({ group_id: groupId });
    } else if (conversationOrGroupId) {
      // If no groupId is provided, treat the parameter as conversationId
      // Fetch messages based on conversationId
      messages = await GroupMessages.find({
        conversationId: conversationOrGroupId,
      });
    } else {
      return res.status(400).json([]);
    }

    if (!messages || messages.length === 0) {
      return res
        .status(404)
        .json("No messages found for this group/conversation.");
    }

    // Create an array to store user details
    const conversationUserData = [];

    // Fetch user details for each message
    for (const message of messages) {
      const senderId = message.senderId; // Assuming you have a senderId field in your message schema
      const conversationId = message.conversationId;

      //       // Fetch user details for the receiverId
      const userData = await new Promise((resolve, reject) => {
        connection.query(
          "SELECT * FROM users WHERE id = ?",
          [senderId],
          (err, result) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              // Extract the user data you need from the result

              const user = {
                user: {
                  id: result[0].id,
                  username: result[0].username,
                  email: result[0].email,
                },
                message: message.message,
                conversationId:conversationId
              };
              // const user = { message: message.message };

              resolve(user);
            }
          }
        );
      });

      // Fetch user details for the senderId
      // const user = await User.findById(senderId);

      // if (!user) {
      //   // Handle the case where the user is not found
      //   console.error(`User not found for senderId: ${senderId}`);
      // } else {
      //   // Extract the user data you need and combine it with the message data
      //   const userData = {
      //     user: {
      //       id: user.id,
      //       username: user.username,
      //       email: user.email,
      //     },
      //     message: message.message,
      //   };

        conversationUserData.push(userData);
      }

      const response = {
        messages: messages,
        conversationUserData: conversationUserData,
      };

          // Send the messages along with user details
    res.status(200).json(conversationUserData);
    }


  // }
   catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});



module.exports = router;
