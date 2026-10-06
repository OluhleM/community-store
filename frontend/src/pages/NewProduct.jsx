import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

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
const CONDITIONS = ["new", "like-new", "used", "for-parts"];

export default function NewProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "other",
    condition: "used",
    imageUrl: "",
    stock: 1,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/products", { ...form, price: Number(form.price) });
      navigate(`/products/${res.data.product._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create listing");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page page-narrow">
      <h1>List an item or service</h1>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>
          Title
          <input required value={form.title} onChange={(e) => update("title", e.target.value)} />
        </label>
        <label>
          Description
          <textarea
            required
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </label>
        <label>
          Price (R)
          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
          />
        </label>
        <label>
          Category
          <select value={form.category} onChange={(e) => update("category", e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Condition
          <select value={form.condition} onChange={(e) => update("condition", e.target.value)}>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Image URL (optional)
          <input value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} />
        </label>
        <label>
          Stock
          <input
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => update("stock", e.target.value)}
          />
        </label>
        {error && <p className="page-error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Publishing..." : "Publish listing"}
        </button>
      </form>
    </div>
  );
}
