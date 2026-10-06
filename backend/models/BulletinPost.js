const mongoose = require("mongoose");

const BulletinPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    category: {
      type: String,
      enum: ["announcement", "event", "service", "lost-and-found", "other"],
      default: "other",
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    eventDate: { type: Date }, // optional, used for "event" posts
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BulletinPost", BulletinPostSchema);
