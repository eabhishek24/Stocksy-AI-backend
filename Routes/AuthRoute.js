// /Routes/AuthRoute.js
const express = require("express");
const { verifyUser } = require("../Controllers/AuthController");

const router = express.Router();

// This will handle POST requests for verifying cookies (dashboard check)
router.post("/", verifyUser);

module.exports = router;
