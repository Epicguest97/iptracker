const { MongoClient } = require('mongodb');

// Use environment variable for MongoDB URI
const uri = process.env.MONGODB_URI;

module.exports = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const logEntry = {
    ip,
    timestamp: new Date().toISOString(),
  };

  try {
    // Connect to MongoDB and log the IP
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db('ip-logs');
    const collection = db.collection('ip-logs');

    await collection.insertOne(logEntry);
    client.close();

    res.status(200).json({ message: 'IP logged successfully' });
  } catch (error) {
    console.error('Error logging IP:', error);
    res.status(500).json({ message: 'Error logging IP' });
  }
};
