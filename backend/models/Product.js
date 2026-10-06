const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: [
        "textbooks",
        "electronics",
        "furniture",
        "clothing",
        "food",
        "services",
        "eco-friendly",
        "other",
      ],
      default: "other",
    },
    condition: {
      type: String,
      enum: ["new", "like-new", "used", "for-parts"],
      default: "used",
    },
    imageUrl: { type: String, default: "" }, // simple text URL, no file uploads needed
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stock: { type: Number, default: 1, min: 0 },
    isActive: { type: Boolean, default: true },
    // Very simple fraud/moderation signal: flagged listings are hidden
    // from the public marketplace until an admin clears them.
    flagged: { type: Boolean, default: false },
    flagReason: { type: String, default: "" },
  },
  { timestamps: true }
);

ProductSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Product", ProductSchema);
