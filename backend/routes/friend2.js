const express = require('express');
const mysql = require("mysql");
const neo4j = require('neo4j-driver');
const connection = require("../connection");
const io = require("../socket");


var router = express();



const neo4jDriver = neo4j.driver('neo4j+s://78208b1f.databases.neo4j.io', neo4j.auth.basic('neo4j', '7Ip5WHgdheXTisuYy9VB959wyzzbXzYkuTjCbQWviN8'));


const createUserNode = async (userId, username) => {
  const neo4jSession = neo4jDriver.session();

  const createUserQuery = `
    MERGE (user:User {userId: $userId})
    SET user.username = $username
  `;

  try {
    await neo4jSession.run(createUserQuery, { userId, username });
    console.log(`User node created in Neo4j for userId: ${userId}`);
  } catch (error) {
    console.error(`Error creating user node in Neo4j for userId: ${userId}`, error);
  } finally {
    neo4jSession.close();
  }
};


// Function to create or update friend relationship in Neo4j
const createFriendRelationship = async (senderUserId, receiverUserId, status = 'Not Accepted') => {
  const neo4jSession = neo4jDriver.session();

  let createRelationshipQuery;

  if (status === 'Accepted') {
    // Update existing relationship if status is 'Accepted'
    createRelationshipQuery = `
      MATCH (sender:User {userId: $senderUserId})-[r:FRIENDS_WITH]->(receiver:User {userId: $receiverUserId})
      SET r.status = $status
      RETURN r
    `;
  } else {
    // Create new relationship if status is 'Not Accepted'
    createRelationshipQuery = `
      MATCH (sender:User {userId: $senderUserId}), (receiver:User {userId: $receiverUserId})
      MERGE (sender)-[r:FRIENDS_WITH]->(receiver)
      SET r.status = $status
      RETURN r
    `;
  }

  try {
    const result = await neo4jSession.run(createRelationshipQuery, { senderUserId, receiverUserId, status });

    if (!result.records.length) {
      console.log('Friend relationship not found.');
    } else {
      console.log(`Friend relationship updated in Neo4j with status: ${status}`);
    }
  } catch (error) {
    console.error('Error creating/updating friend relationship in Neo4j:', error);
  } finally {
    neo4jSession.close();
  }
};



// 

// Initialize the unread notification count
let unreadNotificationCount = 0;

// API endpoint to send friend request
router.post('/sendFriendRequest', async (req, res) => {
  const { senderUsername, receiverUsername } = req.body;

  try {
    // Get sender and receiver user IDs from MySQL
    const senderUserId = await getUserIdByUsername(senderUsername);
    const receiverUserId = await getUserIdByUsername(receiverUsername);

    if (!senderUserId || !receiverUserId) {
      return res.status(404).json({ error: 'User not found' });
    }


        // Create user nodes in Neo4j (if not already exists)
        await createUserNode(senderUserId, senderUsername);
        await createUserNode(receiverUserId, receiverUsername);


    // Create friend relationship in Neo4j
    await createFriendRelationship(senderUserId, receiverUserId);

     // Emit friend request to Socket.IO clients
    const friendRequestData = {
      senderUserId,
      senderUsername,
      receiverUserId,
      receiverUsername,
      status: 'Not Accepted', // Or 'Pending', etc.
    };

    io.emit('friendRequest', { friendRequestData:friendRequestData, from:senderUsername , to:receiverUserId , action: 'removeSuggestion', });

    
    // io.emit('friendRequest', { friendRequestData:friendRequestData, from:senderUsername});

        // Emit a specific event for friend request
        // io.emit('sendfriendRequest',{friendRequestData:friendRequestData,from:senderUsername})

        // Increment the unread notification count
        // unreadNotificationCount++;
        // Here when ever any user send request the unread notification will be increamented and that we will send as event to the frontend 

          // Emit the updated count to the receiver's socket only
          // io.emit('unreadNotificationCount', unreadNotificationCount);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending friend request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Function to get user ID by username from MySQL
const getUserIdByUsername = async (username) => {
  const getUserQuery = 'SELECT id FROM users WHERE username = ?';

  return new Promise((resolve, reject) => {
    connection.query(getUserQuery, [username], (error, results) => {
      if (error) {
        reject(error);
      } else {
        const userId = results[0] ? results[0].id : null;
        resolve(userId);
      }
    });
  });
};





// API to fetch friend requests
//Api to fetch the friend requests that are been send from the sender 
router.post("/get_friend_requests", async (req, res) => {
  // const { username } = req.body;

  const { userId } = req.body;


  try {
    // Get receiver's user ID
    // const receiverUserId = await getUserIdByUsername(username);

    if (!userId) {
      return res.status(401).json({ error: 'Receiver not found' });
    }

    const neo4jSession = neo4jDriver.session();

    // Query Neo4j for friend requests directed towards the receiver
    const getFriendRequestsQuery = `
      MATCH (sender:User)-[r:FRIENDS_WITH {status: 'Not Accepted'}]->(receiver:User {userId: $userId})
      RETURN sender.userId AS senderUserId, sender.username AS senderUsername
    `;

    const result = await neo4jSession.run(getFriendRequestsQuery, { userId });

    const friendRequests = result.records.map(record => ({
      senderUserId: record.get('senderUserId'),
      senderUsername: record.get('senderUsername'),
    }));

    neo4jSession.close();

    // Emit the friend requests to the receiver's socket
    io.to(userId).emit('getfriendRequests', friendRequests);

    return res.status(200).json(friendRequests);
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Api to get accpet the friend requets...(Status will be true from false) 
router.post('/acceptFriendRequest', async (req, res) => {
  const { senderUsername, receiverUsername } = req.body;

  try {
    // Get sender and receiver user IDs from MySQL
    const senderUserId = await getUserIdByUsername(senderUsername);
    const receiverUserId = await getUserIdByUsername(receiverUsername);

    if (!senderUserId || !receiverUserId) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the status of the friend request in your application's logic

    // Create friend relationship in Neo4j with "Accepted" status
    await createFriendRelationship(senderUserId, receiverUserId, 'Accepted');

         // Emit friend request to Socket.IO clients
         const acceptFriendRequestData = {
          senderUserId,
          senderUsername,
          receiverUserId,
          receiverUsername,
          status: 'Accepted', // Or 'Pending', etc.
        };

    io.emit("acceptFriendRequest" , {acceptFriendRequestData : acceptFriendRequestData , from:senderUsername , to : receiverUsername});

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Fetching the friends of the given user in the parameter....
router.get("/getFriends/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const neo4jSession = neo4jDriver.session();

    // Query Neo4j for friends
    const getFriendsQuery = `
      MATCH (u:User {userId: toFloat($userId)})-[:FRIENDS_WITH]-(fof:User)
      RETURN fof;
    `;

    const result = await neo4jSession.run(getFriendsQuery, { userId: parseFloat(userId) });

    // Extracting friends from the result
    const friends = result.records.map(record => {
      const friendNode = record.get('fof');
      const friendProperties = friendNode ? friendNode.properties : {};
      return {
        friendId: friendProperties.userId,
        friendUsername: friendProperties.username,  // Adjust the property name based on your node structure
        // Add other properties as needed
      };
    });

    neo4jSession.close();

    return res.status(200).json({ success: true, friends });
  } catch (error) {
    console.error('Error fetching friends:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Router to delete the friends request send to the user from the sender...

router.delete('/deleteFriendRelationship', async (req, res) => {
  const { senderUsername, receiverUsername } = req.body;

  try {
    // Get sender and receiver user IDs from MySQL
    const senderUserId = await getUserIdByUsername(senderUsername);
    const receiverUserId = await getUserIdByUsername(receiverUsername);

    if (!senderUserId || !receiverUserId) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the friend relationship and nodes in Neo4j
    await deleteFriendRelationship(senderUserId, receiverUserId);

    // You may also want to emit an event to inform clients about the deletion
    io.emit("deleteFriendRelationship", { senderUsername:senderUsername, receiverUsername:receiverUsername });

    return res.status(200).json({ success: true, message: 'Friend relationship deleted' });
  } catch (error) {
    console.error('Error deleting friend relationship:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to delete friend relationship in Neo4j
async function deleteFriendRelationship(senderUserId, receiverUserId) {
  const query = `
  MATCH (:User {userId: $senderUserId})-[r:FRIENDS_WITH {status: "Not Accepted"}]->(:User {userId: $receiverUserId}) DELETE r;`;

  try {
    const session = neo4jDriver.session();
    await session.run(query, { senderUserId, receiverUserId });
  } catch (error) {
    console.error('Error deleting friend relationship:', error);
    throw error; // You might want to handle or log the error accordingly
  }
}



module.exports = router;