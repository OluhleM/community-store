import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import NewProduct from "./pages/NewProduct.jsx";
import Cart from "./pages/Cart.jsx";
import Bulletin from "./pages/Bulletin.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/bulletin" element={<Bulletin />} />
          <Route
            path="/sell"
            element={
              <ProtectedRoute>
                <NewProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>Community Store Project &mdash; connecting campus and neighbourhood.</p>
      </footer>
    </div>
  );
}
