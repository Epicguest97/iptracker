const { MongoClient } = require('mongodb');

// MongoDB connection string (replace with your connection string)
const uri = "mongodb+srv://mehul:<db_password>@cluster0.pajif.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

module.exports = async (req, res) => {
  // Get the user's IP address
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

    // Respond with success message
    res.status(200).json({ message: 'IP logged successfully' });
  } catch (error) {
    console.error('Error logging IP:', error);
    res.status(500).json({ message: 'Error logging IP' });
  }
};
