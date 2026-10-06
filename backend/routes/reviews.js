const express = require("express");
const Review = require("../models/Review");
const Product = require("../models/Product");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /api/reviews/product/:productId
router.get("/product/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("reviewer", "name")
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    res.status(400).json({ message: "Failed to fetch reviews" });
  }
});

// POST /api/reviews  { productId, rating, comment }
router.post("/", requireAuth, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!productId || !rating) {
      return res.status(400).json({ message: "productId and rating are required" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (String(product.seller) === req.user.id) {
      return res.status(400).json({ message: "You cannot review your own listing" });
    }

    const review = await Review.create({
      product: productId,
      seller: product.seller,
      reviewer: req.user.id,
      rating,
      comment,
    });

    // Recalculate the seller's average rating.
    const sellerReviews = await Review.find({ seller: product.seller });
    const avg =
      sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length;

    await User.findByIdAndUpdate(product.seller, {
      ratingAverage: Math.round(avg * 10) / 10,
      ratingCount: sellerReviews.length,
    });

    res.status(201).json({ review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You already reviewed this product" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to submit review" });
  }
});

module.exports = router;
