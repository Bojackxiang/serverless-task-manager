const express = require("express");

const app = express();

const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// Health route
const { health } = require("./controllers/healthController");
app.get("/health", health);

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, dashboard page!");
});

// Tasks route
app.get("/task/", (req, res) => {
  res.send("Hello, GET task page!");
});

app.post("/task/", (req, res) => {
  res.send("Hello, POST task!");
});

// Tasks ID route
app.get("/task/:ID", (req, res) => {
  res.send("Hello, GET task ID!");
});

app.delete("/task/:ID", (req, res) => {
  res.send("Hello, DELETE task ID!");
});

app.patch("/task/:ID", (req, res) => {
  res.send("Hello, UPDATE task ID!");
});

module.exports = app;
