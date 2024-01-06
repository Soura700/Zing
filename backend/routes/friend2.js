const express = require('express');
const mysql = require("mysql");
const neo4j = require('neo4j-driver');
const connection = require("../connection");
const io = require("../socket");

var router = express();

// Neo4j connection
(async () => {
  var neo4j = require('neo4j-driver')

  // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
  const URI = 'neo4j+s://78208b1f.databases.neo4j.io'
  const USER = 'neo4j'
  const PASSWORD = '7Ip5WHgdheXTisuYy9VB959wyzzbXzYkuTjCbQWviN8'
  let driver

  try {
    driver = neo4j.driver(URI,  neo4j.auth.basic(USER, PASSWORD))
    const serverInfo = await driver.getServerInfo()
    console.log('Connection estabilished')
    console.log(serverInfo)
  } catch(err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`)
    await driver.close()
    return
  }

  // Use the driver to run queries

  await driver.close()
})();

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


// Function to create friend relationship in Neo4j
// const createFriendRelationship = async (senderUserId, receiverUserId, status = 'Not Accepted') => {
//   const neo4jSession = neo4jDriver.session();

//   let createRelationshipQuery;

//   if (status === 'Accepted') {
//     createRelationshipQuery = `
//       MATCH (sender:User {userId: $senderUserId}), (receiver:User {userId: $receiverUserId})
//       MERGE (sender)-[r:FRIENDS_WITH]->(receiver)
//       ON CREATE SET r.status = $status
//     `;
//   } else {
//     createRelationshipQuery = `
//       MATCH (sender:User {userId: $senderUserId}), (receiver:User {userId: $receiverUserId})
//       CREATE (sender)-[r:FRIENDS_WITH {status: $status}]->(receiver)
//     `;
//   }

//   try {
//     await neo4jSession.run(createRelationshipQuery, { senderUserId, receiverUserId, status });
//     console.log(`Friend relationship created in Neo4j with status: ${status}`);
//   } catch (error) {
//     console.error('Error creating friend relationship in Neo4j:', error);
//   } finally {
//     neo4jSession.close();
//   }
// };


// Function to create friend relationship in Neo4j
const createFriendRelationship = async (senderUserId, receiverUserId, status = 'Not Accepted') => {
  const neo4jSession = neo4jDriver.session();

  let createRelationshipQuery;

  if (status === 'Accepted') {
    createRelationshipQuery = `
      MATCH (sender:User {userId: $senderUserId}), (receiver:User {userId: $receiverUserId})
      CREATE (sender)-[r:FRIENDS_WITH {status: $status}]->(receiver)
      RETURN r
    `;
  } else {
    createRelationshipQuery = `
      MATCH (sender:User {userId: $senderUserId})-[r:FRIENDS_WITH]->(receiver:User {userId: $receiverUserId})
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

        // Emit a specific event for friend request
        // io.emit('friendRequest', friendRequestData , senderUsername);

        io.emit('friendRequest',{friendRequestData:friendRequestData,from:senderUsername})

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

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;