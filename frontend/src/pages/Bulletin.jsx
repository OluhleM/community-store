import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext.jsx";

const CATEGORIES = ["announcement", "event", "service", "lost-and-found", "other"];

export default function Bulletin() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", body: "", category: "announcement" });
  const [error, setError] = useState("");

  async function loadPosts() {
    const res = await api.get("/bulletin");
    setPosts(res.data.posts);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/bulletin", form);
      setForm({ title: "", body: "", category: "announcement" });
      loadPosts();
    } catch (err) {
      setError(err.response?.data?.message || "Could not post");
    }
  }

  return (
    <div className="page">
      <h1>Community Bulletin Board</h1>
      <p>Announcements, events, services and more from your local community.</p>

      {user && (
        <form className="form-card" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
          <label>
            Details
            <textarea
              required
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
          </label>
          <label>
            Category
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          {error && <p className="page-error">{error}</p>}
          <button type="submit" className="btn-primary">
            Post to bulletin board
          </button>
        </form>
      )}

      <ul className="bulletin-list">
        {posts.map((post) => (
          <li key={post._id} className="bulletin-item">
            <span className="bulletin-category">{post.category}</span>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <p className="product-meta">
              Posted by {post.author?.businessName || post.author?.name}
            </p>
          </li>
        ))}
        {posts.length === 0 && <p className="empty-state">No posts yet.</p>}
      </ul>
    </div>
  );
}
