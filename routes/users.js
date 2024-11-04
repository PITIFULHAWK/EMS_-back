// routes/users.js
const express = require("express");
const router = express.Router();

// Define routes for users
router.get("/", (req, res) => {
  res.send("Get all users");
});

router.post("/", (req, res) => {
  res.send("Add a user");
});

module.exports = router;
