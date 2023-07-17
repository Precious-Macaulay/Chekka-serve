const express = require("express");
const router = express.Router();
const { signup, verifyotp, createpin, login, requestotp } = require("../controllers/auth");


// Public routes
router.post("/signup", signup);
router.post("/verifyotp", verifyotp);
router.post("/createpin", createpin);
router.post("/login", login);
router.post("/requestotp", requestotp)

module.exports = router;

