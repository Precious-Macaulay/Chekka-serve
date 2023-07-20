const express = require("express");
const router = express.Router();

const {
  authenticateToken: authMiddleware,
} = require("../middleware/authMiddleware");

const {
  createDeferPayment,
  deferPayment,
} = require("../controllers/deferController");


router.post("/createdeferpayment", authMiddleware, createDeferPayment);
router.get("/deferpayment", authMiddleware, deferPayment);

module.exports = router;