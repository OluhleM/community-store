import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        🏘️ Community Store
      </Link>
      <nav className="navbar-links">
        <Link to="/">Marketplace</Link>
        <Link to="/bulletin">Bulletin Board</Link>
        {user && <Link to="/sell">Sell an Item</Link>}
        {user && <Link to="/dashboard">My Listings</Link>}
        <Link to="/cart">Cart ({items.length})</Link>
        {user ? (
          <>
            <span className="navbar-user">Hi, {user.name.split(" ")[0]}</span>
            <button onClick={handleLogout} className="btn-link">
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register" className="btn-primary-small">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
