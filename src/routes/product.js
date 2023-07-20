const express = require("express");
const router = express.Router();
const {
  authenticateToken: authMiddleware,
} = require("../middleware/authMiddleware");
const { createProduct, product } = require("../controllers/productController");

router.post("/createproduct", authMiddleware, createProduct);
router.get("/product", authMiddleware, product);

module.exports = router;
