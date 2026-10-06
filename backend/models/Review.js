const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

// One review per reviewer per product.
ReviewSchema.index({ product: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);
