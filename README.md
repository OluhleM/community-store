# Community Store

A full-stack, mobile-first marketplace application built for students, faculty, vendors, and residents. Users can browse products, create their own listings, communicate through reviews, use a demo shopping cart, and interact with community bulletin posts.

The project was developed using React, Node.js, Express, MongoDB Atlas, and Cloudinary.

---

## Features

### Authentication & Users

* User registration and login
* JWT-based authentication
* Password hashing using bcrypt
* Persistent login
* User roles:

    * Student
    * Faculty
    * Vendor
    * Resident
    * Admin
* University email verification for applicable users

### Product Marketplace

* Create product listings
* Upload product images from a computer or mobile device
* Images are stored using Cloudinary
* Product image preview before submitting
* Default image displayed when no product image is provided
* Edit existing listings
* Delete own listings
* Product ownership protection
* Admin listing management
* Product categories
* Product conditions
* Product stock
* Product pricing
* Active/inactive listings
* Product search
* Category filtering
* Price filtering

### Shopping Cart

* Add products to cart
* Increase/decrease product quantities
* Automatically update cart totals
* Remove products from cart
* Cart item count displayed in the navigation
* Demo checkout functionality

### Reviews

* Users can review products/sellers
* Star ratings
* Written reviews
* Users cannot review their own listings
* Reviews remain available after refreshing the page

### Community Bulletin Board

Supports community posts such as:

* Announcements
* Events
* Services
* Lost & Found

### Safety & Reporting

* Users can report listings
* Flagged listings can be identified for review
* Product ownership permissions are enforced by the backend

---

## Technology Stack

### Frontend

* React
* Vite
* React Router
* JavaScript
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt

### External Services

* MongoDB Atlas — database hosting
* Cloudinary — product image storage

---

## Project Structure

```text
community-store/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   │   └── item not found.jpg
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env
│
└── README.md
```

---

# Running the Project Locally

## Requirements

Before running the project, install:

* Node.js
* npm
* Git

You can check whether Node.js and npm are installed by running:

```bash
node -v
npm -v
```

---

# 1. Clone the Repository

Clone the project from GitHub:

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
```

Then enter the project:

```bash
cd community-store
```
# 2. Environment Setup

The project uses environment variables for the MongoDB Atlas database, JWT authentication, and Cloudinary image uploads.

Because this is a group project, all group members can use the same shared development MongoDB Atlas database and Cloudinary account.

**Do not commit the `.env` files to GitHub.** Each group member should create their own `.env` files locally after cloning the repository.

---

## Backend `.env`

Create:

```text
backend/.env
```

Use the following structure:

```env
PORT=5000
MONGO_URI=YOUR_SHARED_MONGODB_ATLAS_CONNECTION_STRING
JWT_SECRET=YOUR_SHARED_JWT_SECRET
CLIENT_URL=http://localhost:5173
```

The project owner/group leader should provide the group members with the actual values for:

```text
MONGO_URI
JWT_SECRET
```

The `MONGO_URI` connects the application to the shared MongoDB Atlas database.

All group members can therefore work with the same database and see changes made by other members.

---

## Frontend `.env`

Create:

```text
frontend/.env
```

Use:

```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=YOUR_SHARED_CLOUDINARY_CLOUD_NAME
VITE_CLOUDINARY_UPLOAD_PRESET=communityStore
```

The project owner/group leader should provide the actual Cloudinary Cloud Name.

The Cloudinary upload preset is:

```text
communityStore
```

This allows group members to upload product images while developing the project locally.

---

## Important

The `.env` files are intentionally not included in the GitHub repository because they contain credentials.

Each group member should:

1. Clone the GitHub repository.
2. Create `backend/.env`.
3. Create `frontend/.env`.
4. Add the shared development values provided by the group leader.
5. Run `npm install` in both `backend` and `frontend`.
6. Start the backend.
7. Start the frontend.

All group members will then be working with the same development database and Cloudinary account.

### Do not commit `.env` files

Before pushing changes to GitHub, make sure `.env` remains ignored by Git.

The repository should contain:

```text
backend/.env.example
frontend/.env.example
```

but **not**:

```text
backend/.env
frontend/.env
```

---

# 3. Set Up the Backend

Open a terminal in the project root and run:

```bash
cd backend
```

Install the backend dependencies:

```bash
npm install
```

---
# 5. Start the Backend

From the `backend` folder:

```bash
npm run dev
```

The backend should start on:

```text
http://localhost:5000
```

The API is available under:

```text
http://localhost:5000/api
```

---

# 6. Set Up the Frontend

Open a second terminal.

From the project root:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

---

# 8. Start the Frontend

From the `frontend` folder:

```bash
npm run dev
```

Vite will normally make the application available at:

```text
http://localhost:5173
```

Open that address in your browser.

---

# Complete Local Startup

After the initial setup, you need two terminals.

### Terminal 1 — Backend

```bash
cd community-store/backend
npm run dev
```

### Terminal 2 — Frontend

```bash
cd community-store/frontend
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# Testing the Application

After starting the application, you can test the main functionality by:

1. Registering a user.
2. Logging in.
3. Creating a product listing.
4. Uploading a product image.
5. Searching for products.
6. Filtering products.
7. Viewing a product.
8. Adding the product to the cart.
9. Changing the quantity.
10. Removing the product.
11. Reviewing another user's product.
12. Opening **My Listings**.
13. Editing a listing.
14. Adding or changing its image.
15. Deleting a listing.
16. Creating a bulletin board post.
17. Reporting a listing.

---

# Important Environment Files

The project uses environment variables for sensitive or machine-specific configuration.

### Backend

```text
backend/.env
```

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

### Frontend

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=communityStore
```

Never commit real passwords, database credentials, JWT secrets, or other private credentials to GitHub.

---

# Default Product Images

Products without an uploaded image use the default image located at:

```text
frontend/public/item not found.jpg
```

The frontend displays this image when a product does not have an `imageUrl`.

---

# API Overview

The backend provides REST API endpoints for the main application functionality.

Examples include:

```text
/api/auth
/api/products
/api/bookings
/api/reviews
/api/bulletin
```

The API uses JWT authentication for protected operations.

Product ownership is also checked on the backend, meaning users cannot edit or delete another user's listings simply by changing an ID in the request.

---

# Security

The application includes several security measures:

* Passwords are hashed with bcrypt.
* Authentication uses JWT tokens.
* Protected routes require authentication.
* Product ownership is checked on the backend.
* Users can only edit their own listings unless they are an admin.
* Users can only delete their own listings unless they are an admin.
* Environment files containing secrets are excluded from Git.

---

# Current Project Status

The following core functionality has been implemented and tested:

* User registration and login
* JWT authentication
* Persistent login
* Role-based access
* Product creation
* Product image uploads
* Product image previews
* Default product images
* Product searching
* Category searching/filtering
* Product listing ownership
* Product editing
* Product deletion
* Cart functionality
* Cart quantity updates
* Cart removal
* Product reviews
* Review restrictions for listing owners
* Community bulletin board
* Listing reporting
* MongoDB Atlas integration
* Cloudinary image storage

---

# Development

The project is intended to be developed and tested locally using:

```text
React + Vite
Node.js + Express
MongoDB Atlas
Cloudinary
```

Frontend development server:

```text
http://localhost:5173
```

Backend development server:

```text
http://localhost:5000
```

---

# Author

Community Store was developed as a full-stack application project using modern web development technologies and a REST-based backend architecture.
