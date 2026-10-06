const express = require("express");
const Product = require("../models/Product");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// GET /api/products?search=&category=&minPrice=&maxPrice=&condition=
router.get("/", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, condition, seller } = req.query;

    const filter = { isActive: true, flagged: false };
    if (category) filter.category = category;
    if (condition) filter.condition = condition;
    if (seller) filter.seller = seller;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const products = await Product.find(filter)
      .populate("seller", "name businessName role ratingAverage ratingCount")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name businessName role ratingAverage ratingCount"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (err) {
    res.status(400).json({ message: "Invalid product id" });
  }
});

// POST /api/products (vendors and students/faculty/residents can all sell)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, description, price, category, condition, imageUrl, stock } = req.body;
    if (!title || !description || price === undefined) {
      return res.status(400).json({ message: "Title, description and price are required" });
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      condition,
      imageUrl,
      stock,
      seller: req.user.id,
    });

    res.status(201).json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create product" });
  }
});

// PUT /api/products/:id (only the seller who owns it, or admin)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (String(product.seller) !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only edit your own listings" });
    }

    const fields = ["title", "description", "price", "category", "condition", "imageUrl", "stock", "isActive"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) product[f] = req.body[f];
    });

    await product.save();
    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
});

// DELETE /api/products/:id
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (String(product.seller) !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own listings" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product" });
  }
});

// POST /api/products/:id/flag - simple community "report" mechanism
router.post("/:id/flag", requireAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.flagged = true;
    product.flagReason = req.body.reason || "Reported by a community member";
    await product.save();

    res.json({ message: "Listing flagged for review" });
  } catch (err) {
    res.status(500).json({ message: "Failed to flag product" });
  }
});

// Admin-only: clear a flag
router.post("/:id/unflag", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.flagged = false;
    product.flagReason = "";
    await product.save();

    res.json({ message: "Listing restored" });
  } catch (err) {
    res.status(500).json({ message: "Failed to unflag product" });
  }
});

module.exports = router;
