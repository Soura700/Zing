// Function to calculate Euclidean distance between two arrays of features
function euclideanDistance(features1, features2) {
  if (features1.length !== features2.length) {
    throw new Error('Feature arrays must have the same length');
  }

  let sumSquaredDiff = 0;
  for (let i = 0; i < features1.length; i++) {
    sumSquaredDiff += Math.pow(features1[i] - features2[i], 2);
  }

  return Math.sqrt(sumSquaredDiff);
}

// Function to find k-nearest neighbors
function kNearestNeighbors(data, query, k) {
  const distances = [];

  for (const point of data) {
    const distance = euclideanDistance(query, point.features);
    distances.push({ label: point.label, distance });
  }

  distances.sort((a, b) => a.distance - b.distance);

  return distances.slice(0, k);
}

// Function to fetch data from MongoDB and run KNN algorithm
async function getDataFromMongoDBAndRunKNN() {
  const mongoURI = 'mongodb://localhost:27017';
  const dbName = 'yourDatabaseName';
  const collectionName = 'yourCollectionName';

  const client = new MongoClient(mongoURI, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to the MongoDB database');

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    // Fetch data from MongoDB
    const data = await collection.find({}).toArray();
    console.log('Data fetched from MongoDB:', data);

    // Replace this with the actual interests for User A
    const userAFeatures = [/* User A's interests array */];

    // Run KNN algorithm
    const k = 3;
    const nearestNeighbors = kNearestNeighbors(data, userAFeatures, k);

    // Display suggested friends
    const suggestedFriends = nearestNeighbors.map(neighbor => neighbor.label);
    console.log('Suggested friends:', suggestedFriends);
  } finally {
    await client.close();
    console.log('Closed the MongoDB connection');
  }
}

// Call the function to fetch data from MongoDB and run the KNN algorithm
getDataFromMongoDBAndRunKNN();
