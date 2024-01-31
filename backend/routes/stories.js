const express = require("express");
const router = express.Router();
const Story = require("../models/Stories");
const io = require("../socket");
const neo4j = require('neo4j-driver');



const neo4jDriver = neo4j.driver('neo4j+s://78208b1f.databases.neo4j.io', neo4j.auth.basic('neo4j', '7Ip5WHgdheXTisuYy9VB959wyzzbXzYkuTjCbQWviN8'));


// Create a new story with photo or video
router.post("/create_story", async (req, res) => {
  const { userId, userName, media, downloadURL } = req.body;

  const story = new Story({
    userId,
    userName,
    views: 0,
    media,
    downloadURL,
  });

  try {
    const newStory = await story.save();
    const friends = await getFriendsByUserId(userId);
    friends.forEach(friend=>{
      const friendSocket = friend.friendId;
      if(friendSocket){
        console.log("Emitted");
        io.emit('new_story',newStory);
      }
    })
    res.status(201).json(newStory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function getFriendsByUserId(userId) {
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
    return friends;
  } catch (error) {
    console.error('Error fetching friends:', error);
    throw error; // Propagate the error to the caller
  }
}

// Get all stories
router.get("/allStories", async (req, res) => {
  try {
    const stories = await Story.find();
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get stories for a specific user
router.get("/getStories/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const stories = await Story.find({ userId });
    const storiesCount = await Story.find({ userId }).count();
    res.status(200).json({ stories, storiesCount });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete a specific story
router.delete("/:id", async (req, res) => {
  try {
    const deletedStory = await Story.findByIdAndRemove(req.params.id);
    if (deletedStory) {
      // Log a message to the console in VS Code
      console.log("Story deleted successfully:", deletedStory);

      res.json({ message: "Story deleted successfully." });
    } else {
      res.status(404).json({ message: "Story not found." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
