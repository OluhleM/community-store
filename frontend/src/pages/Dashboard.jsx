import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  async function loadProducts() {
    const res = await api.get("/products", { params: { seller: user.id } });
    setProducts(res.data.products);
  }

  useEffect(() => {
    if (user) loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleDelete(id) {
    if (!confirm("Delete this listing?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  }

  return (
    <div className="page">
      <h1>My Listings</h1>
      <Link to="/sell" className="btn-primary">
        + New listing
      </Link>

      <ul className="dashboard-list">
        {products.map((p) => (
          <li key={p._id} className="dashboard-item">
            <span>{p.title}</span>
            <span>R{p.price.toFixed(2)}</span>
            <span>{p.flagged ? "⚠️ Flagged for review" : "Active"}</span>
            <button className="btn-link" onClick={() => handleDelete(p._id)}>
              Delete
            </button>
          </li>
        ))}
        {products.length === 0 && <p className="empty-state">You haven't listed anything yet.</p>}
      </ul>
    </div>
  );
}
