import { useEffect, useState } from "react";
import api from "../api/api";
import ProductCard from "../components/ProductCard.jsx";

const CATEGORIES = [
  "textbooks",
  "electronics",
  "furniture",
  "clothing",
  "food",
  "services",
  "eco-friendly",
  "other",
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  async function fetchProducts(params = {}) {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/products", { params });
      setProducts(res.data.products);
    } catch (err) {
      setError("Could not load listings. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    fetchProducts({ search: search || undefined, category: category || undefined });
  }

  return (
    <div className="page">
      <section className="hero">
        <h1>Buy, sell and connect &mdash; right in your community.</h1>
        <p>
          A trusted marketplace for students, faculty, vendors and residents. Verified
          accounts, real reviews, and a bulletin board for what matters locally.
        </p>
      </section>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search listings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      {loading && <p className="page-loading">Loading listings...</p>}
      {error && <p className="page-error">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="empty-state">No listings found. Be the first to sell something!</p>
      )}

      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
