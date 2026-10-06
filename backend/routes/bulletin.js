const express = require("express");
const BulletinPost = require("../models/BulletinPost");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /api/bulletin?category=
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const posts = await BulletinPost.find(filter)
      .populate("author", "name role businessName")
      .sort({ pinned: -1, createdAt: -1 })
      .limit(100);

    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bulletin posts" });
  }
});

// POST /api/bulletin
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, body, category, eventDate } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    const post = await BulletinPost.create({
      title,
      body,
      category,
      eventDate,
      author: req.user.id,
    });

    res.status(201).json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create post" });
  }
});

// DELETE /api/bulletin/:id (author or admin only)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const post = await BulletinPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (String(post.author) !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post" });
  }
});

module.exports = router;
