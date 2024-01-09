const express = require('express');
var router = express();


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
  
  // function hash(value) {
  //   return value.toString().hashCode();
  // }
  
  function hash(value) {
    return value
      .toString()
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }
  
  
  function jaccardSimilarity(targetMinHash, otherMinHash) {

    return targetMinHash.jaccard(otherMinHash);


  }
  
  function generateRankedSuggestions(targetUser, targetUserInterests, allUsers) {

    const targetMinHash = new MinHash();

    targetUserInterests.forEach((interest) => targetMinHash.update(interest));
  
    const rankedSuggestions = [];
  
    for (const user in allUsers) {
      if (user !== targetUser) {
        const userMinHash = new MinHash();
        allUsers[user].forEach((interest) => userMinHash.update(interest));
  
        const similarity = jaccardSimilarity(targetMinHash, userMinHash);
        rankedSuggestions.push({ user, similarity });
      }
    }
  
    return rankedSuggestions.sort((a, b) => b.similarity - a.similarity);

  }
  
  // Example data: users and their sets of interests
  const allUsers = {


    User1: ['interest1', 'interest2', 'interest3'],

    User2: ['interest4', 'interest5'],
    User3: ['interest2', 'interest1', 'interest5'],
    User4: ['interest2', 'interest4', 'interest5'],

    User5: ['interest4', 'interest5'],
    User6: ['interest2', 'interest1', 'interest5'],
    User7: ['interest2', 'interest4', 'interest5'],

    User8: ['interest1', 'interest2', 'interest3'],


    // Add more users and interests obtained through DFS
  };
  
  // Example target user and their interests
  const targetUser = 'User1';
  const targetUserInterests = ['interest1', 'interest2', 'interest3'];
  
  // Example usage:
  const rankedSuggestions = generateRankedSuggestions(targetUser, targetUserInterests, allUsers);
  
  // Print ranked suggestions
  console.log(`Ranked suggestions for ${targetUser}:`);
  rankedSuggestions.forEach((suggestion) =>
    console.log(`${suggestion.user} (Jaccard Similarity: ${suggestion.similarity.toFixed(2)})`)
  );
  
  
  
  
  module.exports = router;