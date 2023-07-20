const express = require("express");
const router = express.Router();
const { monoauth, getBanks } = require("../controllers/monoController");
const { authenticateToken: authMiddleware } = require("../middleware/authMiddleware");

router.post("/monoauth", authMiddleware, monoauth);
router.get("/banks", authMiddleware, getBanks);

module.exports = router;
