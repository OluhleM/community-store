const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Set the domain(s) that count as "university email" for auto-verification.
// Add your own institution's domain(s) here.
const UNIVERSITY_EMAIL_DOMAINS = ["cput.ac.za", "mycput.ac.za"];

function isUniversityEmail(email) {
  const domain = email.split("@")[1]?.toLowerCase();
  return UNIVERSITY_EMAIL_DOMAINS.includes(domain);
}

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    vendorApproved: user.vendorApproved,
    businessName: user.businessName,
    ratingAverage: user.ratingAverage,
    ratingCount: user.ratingCount,
  };
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, businessName, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with that email already exists" });
    }

    const allowedRoles = ["student", "faculty", "vendor", "resident"];
    const finalRole = allowedRoles.includes(role) ? role : "resident";

    // Students/faculty are auto-verified if their email matches the
    // university domain(s) configured above. Vendors are never
    // auto-verified: an admin should approve them (vendorApproved).
    let isVerified = false;
    if ((finalRole === "student" || finalRole === "faculty") && isUniversityEmail(email)) {
      isVerified = true;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: passwordHash,
      role: finalRole,
      isVerified,
      businessName: finalRole === "vendor" ? businessName : undefined,
      phone,
    });

    const token = signToken(user);
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user);
    res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user: toPublicUser(user) });
});

module.exports = router;
