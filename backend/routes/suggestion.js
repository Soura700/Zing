const express = require('express');
var router = express();
const neo4j = require('neo4j-driver');

const neo4jDriver = neo4j.driver('neo4j+s://78208b1f.databases.neo4j.io', neo4j.auth.basic('neo4j', '7Ip5WHgdheXTisuYy9VB959wyzzbXzYkuTjCbQWviN8'));




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
      friendsOfFriends.push(friendId);
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
    res.json({ friendsOfFriends: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await session.close();
  }
});



module.exports = router;