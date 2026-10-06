const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // stored as bcrypt hash
    role: {
      type: String,
      enum: ["student", "faculty", "vendor", "resident", "admin"],
      default: "resident",
    },
    // Students/faculty are considered "verified" automatically if they used
    // a university email domain at registration (see routes/auth.js).
    isVerified: { type: Boolean, default: false },
    // Vendors go through a lightweight manual verification flag.
    vendorApproved: { type: Boolean, default: false },
    businessName: { type: String, trim: true }, // only relevant for vendors
    phone: { type: String, trim: true },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
