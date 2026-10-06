// Optional: populates the database with a few demo users, products and
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

  await Promise.all([User.deleteMany({}), Product.deleteMany({}), BulletinPost.deleteMany({})]);

  const passwordHash = await bcrypt.hash("password123", 10);

  const student = await User.create({
    name: "Thandi Nkosi",
    email: "thandinkosi@mycput.ac.za",
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

  await Product.create([
    {
      title: "Used Calculus Textbook (3rd Edition)",
      description: "Good condition, some highlighting. Great for first-year students.",
      price: 150,
      category: "textbooks",
      condition: "used",
      seller: student._id,
    },
    {
      title: "Freshly Baked Sourdough Loaf",
      description: "Baked daily. Order by 6pm for next-day pickup.",
      price: 45,
      category: "food",
      condition: "new",
      seller: vendor._id,
    },
    {
      title: "Second-hand Study Desk",
      description: "Sturdy wooden desk, minor scratches. Buyer collects.",
      price: 300,
      category: "furniture",
      condition: "used",
      seller: resident._id,
    },
  ]);

  await BulletinPost.create([
    {
      title: "Campus Clothing Swap this Saturday",
      body: "Bring 3 items, take 3 items. Sustainability Society, 10am at the Quad.",
      category: "event",
      author: student._id,
    },
    {
      title: "Free Coding Tutoring - Tuesdays",
      body: "Faculty volunteers offering free tutoring for first-years, room 204.",
      category: "service",
      author: vendor._id,
    },
  ]);

  console.log("Seed data created. Demo login password for all accounts: password123");
  console.log("  Student: thandi@mycput.ac.za");
  console.log("  Vendor:  sipho@localcafe.co.za");
  console.log("  Resident: anna@example.com");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
