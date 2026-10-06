// Optional: populates the database with demo users, products and
// bulletin posts so the app isn't empty on first run.
// Run with: npm run seed

require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product");
const BulletinPost = require("./models/BulletinPost");

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    BulletinPost.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash("password123", 10);

  // =========================
  // USERS
  // =========================

  const thandi = await User.create({
    name: "Thandi Nkosi",
    email: "thandinkosi@mycput.ac.za",
    password: passwordHash,
    role: "student",
    isVerified: true,
  });

  const andile = await User.create({
    name: "Andile Mkhize",
    email: "andilemkhize@cput.ac.za",
    password: passwordHash,
    role: "student",
    isVerified: true,
  });

  const vendor = await User.create({
    name: "Sipho Dlamini",
    email: "siphodlamini@localcafe.co.za",
    password: passwordHash,
    role: "vendor",
    businessName: "Sipho's Local Cafe",
    vendorApproved: true,
  });

  const resident = await User.create({
    name: "Anna van der Merwe",
    email: "anna@example.com",
    password: passwordHash,
    role: "resident",
  });

  // =========================
  // PRODUCTS
  // =========================

  await Product.create([
    // ----- THANDI -----

    {
      title: "Scientific Calculator",
      description:
          "Good working scientific calculator. Ideal for mathematics, statistics and other university modules.",
      price: 180,
      category: "electronics",
      condition: "used",
      seller: thandi._id,
      stock: 1,
    },

    {
      title: "ICT Programming Textbook",
      description:
          "Useful programming textbook for students studying computer science and ICT. Some highlighting but still in good condition.",
      price: 220,
      category: "textbooks",
      condition: "used",
      seller: thandi._id,
      stock: 1,
    },

    {
      title: "CPUT Student Hoodie",
      description:
          "Comfortable student hoodie in good condition. Perfect for keeping warm on campus.",
      price: 250,
      category: "clothing",
      condition: "used",
      seller: thandi._id,
      stock: 1,
    },

    // ----- ANDILE -----

    {
      title: "Wireless Computer Mouse",
      description:
          "Wireless mouse in good working condition. Suitable for laptops and desktop computers.",
      price: 150,
      category: "electronics",
      condition: "like-new",
      seller: andile._id,
      stock: 1,
    },

    {
      title: "Student Backpack",
      description:
          "Durable backpack with space for a laptop, textbooks and other university essentials.",
      price: 200,
      category: "other",
      condition: "used",
      seller: andile._id,
      stock: 1,
    },

    {
      title: "Study Desk Lamp",
      description:
          "Compact desk lamp suitable for studying at night. Works well and is easy to move between rooms.",
      price: 120,
      category: "furniture",
      condition: "used",
      seller: andile._id,
      stock: 1,
    },

    // ----- EXISTING DEMO PRODUCTS -----

    {
      title: "Freshly Baked Sourdough Loaf",
      description:
          "Baked daily. Order by 6pm for next-day pickup.",
      price: 45,
      category: "food",
      condition: "new",
      seller: vendor._id,
      stock: 10,
    },

    {
      title: "Second-hand Study Desk",
      description:
          "Sturdy wooden desk, minor scratches. Buyer collects.",
      price: 300,
      category: "furniture",
      condition: "used",
      seller: resident._id,
      stock: 1,
    },
  ]);

  // =========================
  // BULLETIN POSTS
  // =========================

  await BulletinPost.create([
    {
      title: "Campus Clothing Swap this Saturday",
      body:
          "Bring 3 items, take 3 items. Sustainability Society, 10am at the Quad.",
      category: "event",
      author: thandi._id,
    },

    {
      title: "Free Coding Tutoring - Tuesdays",
      body:
          "Faculty volunteers offering free tutoring for first-years, room 204.",
      category: "service",
      author: vendor._id,
    },
  ]);

  console.log(
      "Seed data created. Demo login password for all accounts: password123"
  );

  console.log("  Student: thandinkosi@mycput.ac.za");
  console.log("  Student: andilemkhize@cput.ac.za");
  console.log("  Vendor:  siphodlamini@localcafe.co.za");
  console.log("  Resident: anna@example.com");

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
