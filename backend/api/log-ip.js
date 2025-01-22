require('dotenv').config();
const { MongoClient } = require('mongodb');

// Use environment variable for MongoDB URI
const uri = process.env.MONGODB_URI;
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = client.db('ip-logs');

  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

module.exports = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const logEntry = {
    ip,
    timestamp: new Date().toISOString(),
  };

  try {
    // Connect to MongoDB and log the IP
    const { db } = await connectToDatabase();
    const collection = db.collection('ip-logs');

    await collection.insertOne(logEntry);

    res.status(200).json({ message: 'IP logged successfully' });
  } catch (error) {
    console.error('Error logging IP:', error.message);
    res.status(500).json({ message: 'Error logging IP' });
  }
};
