const express = require('express');
var router = express();
const neo4j = require('neo4j-driver');

const neo4jDriver = neo4j.driver('neo4j+s://78208b1f.databases.neo4j.io', neo4j.auth.basic('neo4j', '7Ip5WHgdheXTisuYy9VB959wyzzbXzYkuTjCbQWviN8'));

const Interests = require("../models/Interests");
const io = require('../socket');

async function fetchInterestsFromMongoDB(userId) { //Fetching the interests from the mongodb and returning...
  try {
    const userInterests = await Interests.findOne({ userId }).exec();
    return userInterests ? userInterests.interests : [];
  } catch (error) {
    console.error('Error fetching interests from MongoDB:', error);
    return [];
  }
}


async function friendsOfFriendsDFS(session, userId, visited = new Set()) {
  visited.add(userId);

  const result = await session.run(
    `
    MATCH (u:User {userId: $userId})-[:FRIENDS_WITH]-(fof:User)
    RETURN fof;
    `,
    { userId: userId }
  );

  const friendsOfFriends = [];
  for (const record of result.records) {

    const friendId = record.get('fof').properties.userId;
    if (!visited.has(friendId)) {

    // Fetch interests from MongoDB for the current friendId
    const interests = await fetchInterestsFromMongoDB(friendId);


      // friendsOfFriends.push(friendId);

      friendsOfFriends.push({ userId: friendId, interests });


      const nestedFriends = await friendsOfFriendsDFS(session, friendId, visited);
      friendsOfFriends.push(...nestedFriends);
    }
  
  }

  // console.log("nestedFriends");
  // console.log(friendsOfFriends);

  return friendsOfFriends;
}


async function fetchRelatedFriends(session,userId) {


  const result = await session.run(
    `
    MATCH (u:User {userId: $userId})-[:FRIENDS_WITH]-(fof:User)
    RETURN fof;
    `,
    { userId: userId }
  );

  let relatedFriends = [];
  for (const record of result.records) {
    const friendNode = record.get('fof');
    const friendId = friendNode.properties.userId;
    // console.log("Friend ID:", friendId);

    // You can perform additional operations or filtering here if needed

        // Fetch interests for the current friendId
        const interests = await fetchInterestsFromMongoDB(friendId);

        relatedFriends.push({ userId: friendId, interests });
  }

  return relatedFriends;
}


// function findUniqueFriends(array1, array2) {

//   const uniqueFriends = [];

//   for (const friend1 of array1) {
//     let isUnique = true;

//     for (const friend2 of array2) {
//       if (friend1.userId === friend2.userId) {
//         isUnique = false;
//         break;
//       }
//     }

//     if (isUnique) {
//       uniqueFriends.push(friend1);
//     }
//   }

//   return uniqueFriends;
// }

// Finding the unique friends..
function findUniqueFriends(array1, array2) {
  const uniqueFriends = [];
  const userIdsSet = new Set(array2.map(friend => friend.userId));

  for (const friend1 of array1) {
    if (!userIdsSet.has(friend1.userId)) {
      uniqueFriends.push(friend1);
    }
  }

  return uniqueFriends;
}










router.get('/api/friendsOfFriends/:userId', async (req, res) => {
  const userId = parseFloat(req.params.userId);

  const session = neo4jDriver.session();

  try {
    const result = await friendsOfFriendsDFS(session, userId);

    // console.log("result");
    // console.log(result);


    res.json({ friendsOfFriends: result });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await session.close();
  }
});

class MinHash {
  constructor() {
    this.hashValues = [];
  }

  update(value) {
    this.hashValues.push(hash(value));
  }

  jaccard(otherMinHash) {
    const intersection = this.hashValues.filter((hashValue) =>
      otherMinHash.hashValues.includes(hashValue)
    );
    const union = Array.from(new Set([...this.hashValues, ...otherMinHash.hashValues]));

    return intersection.length / union.length;
  }
}

// Hashing the values...
function hash(value) {
  return value.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}


async function generateRankedSuggestionsFromNeo4jAndMongoDB(targetUserId, targetUserInterests) {
  const session = neo4jDriver.session();

  try {
    const allresult = await friendsOfFriendsDFS(session, targetUserId); //Gives the dfs means all the nodes starting from the parent....
    const relationedResult = await fetchRelatedFriends(session,targetUserId); //Gives only the nodes that are relationed with the FRIENDS_WITH relation in neo4j database....

    const result = findUniqueFriends(allresult,relationedResult);

    console.log("Resultttttttttttttttttttttttttttttttttttttttttt");
    console.log(result);

    const allUsers = {};

    // Populate allUsers with data obtained from Neo4j and MongoDB
    for (const friendData of result) {
      const friendId = friendData.userId;

      const friendInterests = await fetchInterestsFromMongoDB(friendId);

      allUsers[friendId] = friendInterests;
    }


    // Add the target user's data
    allUsers[targetUserId] = targetUserInterests;



    const targetMinHash = new MinHash();
    targetUserInterests.forEach((interest) => targetMinHash.update(interest));

    const rankedSuggestions = [];



    for (const user in allUsers) {
      const numberUserInteger = parseInt(user);

      if (numberUserInteger !== targetUserId) {




        const userMinHash = new MinHash();
        // console.log(allUsers[user]);
        allUsers[user].forEach((interest) => userMinHash.update(interest));

        

        const similarity = targetMinHash.jaccard(userMinHash);

        rankedSuggestions.push({ user, similarity });

      }
    }

    rankedSuggestions.sort((a, b) => b.similarity - a.similarity);

    return rankedSuggestions.sort((a, b) => b.similarity - a.similarity);
  } catch (error) {
    console.error('Error generating ranked suggestions:', error);
    throw error;
  } finally {
    await session.close();
  }
}




function filterRankedSuggestionsDynamicThreshold(rankedSuggestions, targetUserId , percentageThreshold , dismissedSuggestion) {

  if (!rankedSuggestions.length) {
    return {}; // Return an empty object if there are no suggestions
  }

  // Calculate the dynamic threshold as a percentage of the maximum similarity

  // const dismissedSuggestion = 4;


  const maxSimilarity = rankedSuggestions[0].similarity;


  const dynamicThreshold = maxSimilarity * (percentageThreshold / 100);

  const filteredResults = {};

  for (const suggestion of rankedSuggestions) {

    console.log(suggestion.user);

    if(suggestion.user == dismissedSuggestion)
     {
        console.log("Hello");
        continue; //Skipping to the next itertion of the loop;
     }

    if (suggestion.user !== targetUserId && suggestion.similarity >= dynamicThreshold) {

      filteredResults[suggestion.user] = suggestion.similarity;
    } else if (suggestion.similarity < dynamicThreshold) {

      // Break the loop if the similarity falls below the threshold
      break;
    }
  }

  return filteredResults;
}

function calculateDynamicPercentageThreshold(numSuggestions) {
  // Adjust the threshold based on the number of suggestions
  if (numSuggestions <= 5) {
    return 20; // High threshold if few suggestions
  } else {
    return 20; // Lower threshold if more suggestions
  }
}



// Here onlciking the dismiss button in the rightbar jsx emitting a socket event to the backend...
// I am fetching the targetUserId (means who has clicked the dismiss button) and the dismieesedUserId(whom i have dismmied) and creating nodes and a realtion in the neo4j database with relation **Dismissed**
io.on('connection', (socket) => {
  socket.on('dismissSuggestion', async({ targetUserId, dismissedUserId }) => {
    // Handle the 'dismissSuggestion' event here
    console.log(`User ${dismissedUserId} dismissed a suggestion for user ${targetUserId}`);

    // dismissedSuggestion = dismissedUserId;

    const session =neo4jDriver.session(); 

    try{
     await session.run(
      'CREATE (u:User {userId: $userId})-[:DISMISSED]->(d:Dismissed {dismissedUserId: $dismissedUserId})',
      { userId: targetUserId, dismissedUserId }
     )
    }finally {
      await session.close();
    }
    // console.log(dismissedSuggestion);
    // Your logic to mark the suggestion as dismissed in the database
    // Update the database record for targetUserId to mark dismissedUserId as dismissed

    // Broadcast the dismissal to other connected clients if needed
    socket.broadcast.emit('dismissalUpdate', { targetUserId, dismissedUserId });
  });
});


// Function to fetch dismissed suggestions from Neo4j by the targetUserId means the user who is loggedin(Here i am returing the dismissed user Id)
async function fetchDismissedSuggestions(targetUserId) {
  const session = neo4jDriver.session();

  try {
    const result = await session.run(
      'MATCH (u:User {userId: $userId})-[:DISMISSED]->(d:Dismissed) RETURN d.dismissedUserId',
      { userId: targetUserId }
    );

    return result.records.map(record => record.get('d.dismissedUserId'));
  } finally {
    await session.close();
  }
}


// Api to get the suggestion
router.get('/api/filteredSuggestions/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);  

  try {
    const session = neo4jDriver.session();
    const targetUserInterests = await fetchInterestsFromMongoDB(userId); //Fetching the user interests from the mongodb by userId 
    const rankedSuggestions = await generateRankedSuggestionsFromNeo4jAndMongoDB(userId, targetUserInterests); //Generating the ranked suggestion by jaccard 
    const dynamicPercentageThreshold = calculateDynamicPercentageThreshold(rankedSuggestions.length); //Calculating a thresold value dynamically 
    const dismissedSuggestions = await fetchDismissedSuggestions(userId); //For dimissed User Id (sending this to the filtered suggestion funciton)
    const filteredResults = filterRankedSuggestionsDynamicThreshold(rankedSuggestions, userId, dynamicPercentageThreshold , dismissedSuggestions); //Filtered suggestions that will be shown to the users(loggedin means me)
    res.status(200).json({ filteredResults });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;