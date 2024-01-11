const express = require('express');
var router = express();
const neo4j = require('neo4j-driver');

const neo4jDriver = neo4j.driver('neo4j+s://78208b1f.databases.neo4j.io', neo4j.auth.basic('neo4j', '7Ip5WHgdheXTisuYy9VB959wyzzbXzYkuTjCbQWviN8'));

const Interests = require("../models/Interests");



// router.get('/api/friendsOfFriends/:userId', async (req, res) => {
//   const userId = parseFloat(req.params.userId);

//   const session = neo4jDriver.session();

//   try {
//     const result = await session.run(

//       //       // `MATCH (u:User {userId: $userId})-[:FRIENDS_WITH*2..]-(fof:User)
// //       // WHERE fof <> u AND NOT (u)-[:FRIENDS_WITH]-(fof)
// //       // RETURN DISTINCT fof`
// //       // ,
//       `
//       MATCH (u:User {userId: $userId})-[:FRIENDS_WITH]-(fof:User)-[:FRIENDS_WITH]-(fofof:User)
//       WHERE fof <> u AND NOT (u)-[:FRIENDS_WITH]-(fofof) AND (u)-[:FRIENDS_WITH]-(fof)
//       RETURN DISTINCT fofof;
//       `,
//       { userId: userId }
//     );

//     const friendsOfFriends = result.records.map(record => record.get('fofof').properties);
//     res.json({ friendsOfFriends });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   } finally {
//     await session.close();
//   }
// });

async function fetchInterestsFromMongoDB(userId) {
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

  return friendsOfFriends;
  
}

router.get('/api/friendsOfFriends/:userId', async (req, res) => {
  const userId = parseFloat(req.params.userId);

  const session = neo4jDriver.session();

  try {
    const result = await friendsOfFriendsDFS(session, userId);

    console.log("result");
    console.log(result);


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

function hash(value) {
  return value.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

async function generateRankedSuggestionsFromNeo4jAndMongoDB(targetUserId, targetUserInterests) {
  const session = neo4jDriver.session();

  try {
    const result = await friendsOfFriendsDFS(session, targetUserId);
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
      if (user !== targetUserId) {
        const userMinHash = new MinHash();
        allUsers[user].forEach((interest) => userMinHash.update(interest));

        const similarity = targetMinHash.jaccard(userMinHash);
        rankedSuggestions.push({ user, similarity });
      }
    }

    return rankedSuggestions.sort((a, b) => b.similarity - a.similarity);
  } catch (error) {
    console.error('Error generating ranked suggestions:', error);
    throw error;
  } finally {
    await session.close();
  }
}

// Example usage:
async function main() {
  const targetUserId = 1; // Replace with the actual target user ID
  const targetUserInterests = await fetchInterestsFromMongoDB(targetUserId);

  try {
    const rankedSuggestions = await generateRankedSuggestionsFromNeo4jAndMongoDB(
      targetUserId,
      targetUserInterests
    );

    // Print ranked suggestions
    console.log(`Ranked suggestions for User ${targetUserId}:`);
    rankedSuggestions.forEach((suggestion) =>
      console.log(`${suggestion.user} + Hello +  (Jaccard Similarity: ${suggestion.similarity.toFixed(2)})`)
    );
  } catch (error) {
    console.error('Error:', error);
  }
}


function filterRankedSuggestionsDynamicThreshold(rankedSuggestions, percentageThreshold) {

  if (!rankedSuggestions.length) {
    return {}; // Return an empty object if there are no suggestions
  }

  // Calculate the dynamic threshold as a percentage of the maximum similarity
  console.log("maxSimilarity 11111");
  console.log(rankedSuggestions[0]);
  const maxSimilarity = rankedSuggestions[0].similarity;
  console.log("maxSimilarity");
  console.log(maxSimilarity)
  const dynamicThreshold = maxSimilarity * (percentageThreshold / 100);

  const filteredResults = {};

  for (const suggestion of rankedSuggestions) {

    if (suggestion.similarity >= dynamicThreshold) {
      filteredResults[suggestion.user] = suggestion.similarity;
    } else {
      // Break the loop if the similarity falls below the threshold
      break;
    }
  }

  return filteredResults;
}

function calculateDynamicPercentageThreshold(numSuggestions) {
  // Adjust the threshold based on the number of suggestions
  if (numSuggestions <= 5) {
    return 80; // High threshold if few suggestions
  } else {
    return 60; // Lower threshold if more suggestions
  }
}


// // Example usage:
// const targetUserId = 1; // Replace with the actual target user ID
// const targetUserInterests = await fetchInterestsFromMongoDB(targetUserId);
(async () => {
  const targetUserId = 1; // Replace with the actual target user ID
  const targetUserInterests = await fetchInterestsFromMongoDB(targetUserId);

  try {
    const rankedSuggestions = await generateRankedSuggestionsFromNeo4jAndMongoDB(
      targetUserId,
      targetUserInterests
    );

    // Set the percentage threshold dynamically
    // const percentageThreshold = 75; // Adjust the percentage as needed

        // Calculate the dynamic percentage threshold based on the number of suggestions

        console.log(rankedSuggestions.length);
    const dynamicPercentageThreshold = calculateDynamicPercentageThreshold(rankedSuggestions.length);


    // Use the filter function with the dynamic threshold
    // const filteredResults = filterRankedSuggestionsDynamicThreshold(rankedSuggestions, percentageThreshold);

    const filteredResults = filterRankedSuggestionsDynamicThreshold(rankedSuggestions, dynamicPercentageThreshold);


    // Print the filtered results
    console.log(`Filtered results for User ${targetUserId} above dynamic similarity threshold:`);
    console.log(filteredResults);
  } catch (error) {
    console.error('Error:', error);
  }
})();



main();


module.exports = router;