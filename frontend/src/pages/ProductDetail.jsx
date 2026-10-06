import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewError, setReviewError] = useState("");
  const [added, setAdded] = useState(false);

  async function loadData() {
    try {
      const [productRes, reviewRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/reviews/product/${id}`),
      ]);
      setProduct(productRes.data.product);
      setReviews(reviewRes.data.reviews);
    } catch (err) {
      setError("Listing not found.");
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleReviewSubmit(e) {
    e.preventDefault();
    setReviewError("");
    try {
      await api.post("/reviews", { productId: id, ...reviewForm });
      setReviewForm({ rating: 5, comment: "" });
      loadData();
    } catch (err) {
      setReviewError(err.response?.data?.message || "Could not submit review");
    }
  }

  async function handleFlag() {
    if (!confirm("Report this listing as suspicious or fraudulent?")) return;
    await api.post(`/products/${id}/flag`, { reason: "Reported by community member" });
    alert("Thanks - our moderation team will take a look.");
  }

  if (error) return <p className="page-error">{error}</p>;
  if (!product) return <p className="page-loading">Loading...</p>;

  return (
    <div className="page">
      <div className="product-detail">
        <div className="product-detail-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.title} />
          ) : (
            <div className="product-card-placeholder large">{product.category}</div>
          )}
        </div>
        <div className="product-detail-info">
          <h1>{product.title}</h1>
          <p className="product-card-price large">R{product.price.toFixed(2)}</p>
          <p>{product.description}</p>
          <p className="product-meta">
            Condition: {product.condition} &middot; Category: {product.category} &middot; Stock:{" "}
            {product.stock}
          </p>
          <p className="product-meta">
            Sold by{" "}
            <strong>{product.seller?.businessName || product.seller?.name}</strong>
            {product.seller?.ratingCount > 0 && (
              <> &middot; ⭐ {product.seller.ratingAverage} ({product.seller.ratingCount} reviews)</>
            )}
          </p>
          <div className="product-detail-actions">
            <button
              className="btn-primary"
              onClick={() => {
                addItem(product);
                setAdded(true);
              }}
            >
              {added ? "Added to cart ✓" : "Add to cart"}
            </button>
            {user && <button className="btn-link" onClick={handleFlag}>Report listing</button>}
          </div>
        </div>
      </div>

      <section className="reviews-section">
        <h2>Reviews ({reviews.length})</h2>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        <ul className="review-list">
          {reviews.map((r) => (
            <li key={r._id} className="review-item">
              <strong>{"⭐".repeat(r.rating)}</strong> &mdash; {r.reviewer?.name || "Anonymous"}
              {r.comment && <p>{r.comment}</p>}
            </li>
          ))}
        </ul>

        {user ? (
          <form className="form-card" onSubmit={handleReviewSubmit}>
            <label>
              Rating
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} star{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Comment
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              />
            </label>
            {reviewError && <p className="page-error">{reviewError}</p>}
            <button type="submit" className="btn-primary">
              Submit review
            </button>
          </form>
        ) : (
          <p>
            <Link to="/login">Log in</Link> to leave a review.
          </p>
        )}
      </section>
    </div>
  );
}
