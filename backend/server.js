// server.js
const express = require("express");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to log IP
app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const logEntry = `${new Date().toISOString()} - IP: ${ip}\n`;

  console.log(logEntry); // Logs to console
  fs.appendFileSync("ip-log.txt", logEntry); // Logs to a file

  next();
});

// Serve a simple webpage
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to My Website</h1>
    <p>Your activity is being logged for educational purposes.</p>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
