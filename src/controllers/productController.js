const Product = require("../models/product");
const asyncHandler = require("express-async-handler");

exports.createProduct = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { name, price, quantity, cost_type } = req.body;

  const product = new Product({
    user_id: _id,
    name,
    price,
    quantity,
    cost_type,
  });

  await product.save();

  res.json({
    success: true,
    message: "Product created successfully",
  });
});

exports.product = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const products = await Product.find({ user_id: _id });

  if (products.length === 0) {
    // No product found
    return res.json({
      success: false,
      message: "No product found",
    });
  }

  res.json({
    success: true,
    data: products,
  });
});
