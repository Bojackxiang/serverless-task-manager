const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Health route
const { health } = require("./controllers/healthController");
app.get("/health", health);

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

module.exports = app;
