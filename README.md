# Community Store Project

A mobile-first community marketplace connecting students, faculty, vendors and
residents — with verified accounts, ratings/reviews, and a community bulletin
board. Built with **React + Vite** (frontend) and **Node.js + Express +
MongoDB** (backend), so everything can be developed for free and hosted for
free.

## Project structure

```
community-store/
├── backend/     Express API + MongoDB models
└── frontend/    React + Vite single-page app
```

## Features implemented

- Multi-role accounts: student, faculty, vendor, resident (+ admin)
- University-email auto-verification for students/faculty
- Product listings with search, category and price filters
- Cart & (demo) checkout flow
- Star ratings & written reviews per seller
- Community bulletin board (announcements, events, services, lost & found)
- Simple "report listing" flagging for trust & safety
- JWT authentication, bcrypt password hashing

## 1. Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm (comes with Node)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account
  (this is the free hosted database)
- IntelliJ IDEA (or any editor) — open the `community-store` folder as a
  project; IntelliJ will detect it as a Node/JS project automatically once
  `node_modules` exist

## 2. Set up the free database (MongoDB Atlas)

1. Sign up at https://www.mongodb.com/cloud/atlas/register (free tier, no
   credit card needed for the M0 cluster).
2. Create a new **free M0 cluster**.
3. Under **Database Access**, create a database user with a username and
   password.
4. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) —
   fine for a student project; tighten this later for production.
5. Click **Connect > Drivers**, copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`

## 3. Run the backend locally

```bash
cd backend
npm install
cp .env .env
```

Edit `.env` and paste your Atlas connection string into `MONGO_URI` (add a
database name at the end, e.g. `.../community-store?retryWrites=true...`).
Set `JWT_SECRET` to any long random string.

```bash
npm run seed   # optional: adds demo users/products/bulletin posts
npm run dev    # starts the API on http://localhost:5000
```

Demo accounts created by `npm run seed` (password for all: `password123`):
- Student: `thandi@myuni.ac.za`
- Vendor: `sipho@localcafe.co.za`
- Resident: `anna@example.com`

> To make your own university's email domain auto-verify students/faculty,
> edit `UNIVERSITY_EMAIL_DOMAINS` in `backend/routes/auth.js`.

## 4. Run the frontend locally

```bash
cd frontend
npm install
cp .env .env   # VITE_API_URL should point at your backend
npm run dev             # starts the app on http://localhost:5173
```

Open http://localhost:5173 in your browser.

## 5. Deploying for free

**Backend → Render.com**
1. Push this repo to GitHub.
2. On [Render](https://render.com), create a new **Web Service**, connect
   your repo, set the root directory to `backend`.
3. Build command: `npm install` — Start command: `npm start`.
4. Add environment variables `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your
   deployed frontend URL) in Render's dashboard.
5. Render gives you a free `https://your-api.onrender.com` URL.

**Frontend → Vercel or Netlify**
1. On [Vercel](https://vercel.com) or [Netlify](https://netlify.com), import
   the same GitHub repo, set the root directory to `frontend`.
2. Build command: `npm run build` — Output directory: `dist`.
3. Add environment variable `VITE_API_URL` = `https://your-api.onrender.com/api`.
4. Deploy — you'll get a free `https://your-app.vercel.app` URL.

Both Render's free web service tier and MongoDB Atlas's M0 tier are free
forever (Render's free tier does spin down after inactivity and takes ~30s to
wake up on the first request — worth mentioning in your project report as a
known limitation).

## 6. Mapping back to the project brief

- **Trust & safety**: university-email verification, seller ratings, listing
  "report" button (`flagged` field on products).
- **Payment security**: the current checkout is a demo stub —
  `frontend/src/pages/Cart.jsx` is where you'd integrate a real gateway like
  PayFast or SnapScan.
- **Scalability**: stateless Express API + MongoDB Atlas can be scaled
  independently; Render/Vercel both auto-scale on their free tiers within
  limits.
- **Community engagement**: the Bulletin Board (`/bulletin`) covers
  announcements, events, services and lost & found posts.

## 7. Suggested next steps for your project report

- Add image upload (e.g. via Cloudinary's free tier) instead of image URLs.
- Add an admin panel to review flagged listings and approve vendors.
- Integrate a real payment gateway and escrow flow for high-value items.
- Add automated tests and a CI pipeline (GitHub Actions has a free tier) —
  useful evidence for your "testing & QA" project management deliverable.
