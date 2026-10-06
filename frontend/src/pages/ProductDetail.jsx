import { useEffect, useState } from "react";
import { useParams, useSearchParams,  Link } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

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

export default function ProductDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewError, setReviewError] = useState("");
  const [added, setAdded] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editError, setEditError] = useState("");

  async function loadData() {
    try {
      const [productRes, reviewRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/reviews/product/${id}`),
      ]);

      const loadedProduct = productRes.data.product;

      setProduct(loadedProduct);

      if (
          searchParams.get("edit") === "true" &&
          user &&
          (
              String(loadedProduct.seller?._id) === String(user.id) ||
              user.role === "admin"
          )
      ) {
        setEditForm({
          title: loadedProduct.title || "",
          description: loadedProduct.description || "",
          price: loadedProduct.price || "",
          category: loadedProduct.category || "",
          condition: loadedProduct.condition || "",
          imageUrl: loadedProduct.imageUrl || "",
          stock: loadedProduct.stock ?? 1,
        });

        setEditing(true);
      }
      setReviews(reviewRes.data.reviews);
    } catch (err) {
      setError("Listing not found.");
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function startEditing() {
    setEditError("");

    setEditForm({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      condition: product.condition,
      stock: product.stock,
      imageUrl: product.imageUrl || "",
    });

    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
    setEditForm(null);
    setEditError("");
  }

  function updateEditField(field, value) {
    setEditForm((form) => ({
      ...form,
      [field]: value,
    }));
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setEditError("");

    if (!file.type.startsWith("image/")) {
      setEditError("Please select an image file.");
      return;
    }

    setUploadingImage(true);

    try {
      const uploadData = new FormData();

      uploadData.append("file", file);
      uploadData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

      const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: uploadData,
          }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Image upload failed");
      }

      updateEditField("imageUrl", data.secure_url);
    } catch (err) {
      setEditError(err.message || "Could not upload image");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();

    setEditError("");
    setSaving(true);

    try {
      const res = await api.put(`/products/${id}`, {
        title: editForm.title,
        description: editForm.description,
        price: Number(editForm.price),
        category: editForm.category,
        condition: editForm.condition,
        stock: Number(editForm.stock),
        imageUrl: editForm.imageUrl,
      });

      setProduct(res.data.product);
      setEditing(false);
      setEditForm(null);
    } catch (err) {
      setEditError(
          err.response?.data?.message || "Could not update listing"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    setReviewError("");

    try {
      await api.post("/reviews", {
        productId: id,
        ...reviewForm,
      });

      setReviewForm({ rating: 5, comment: "" });
      loadData();
    } catch (err) {
      setReviewError(
          err.response?.data?.message || "Could not submit review"
      );
    }
  }

  async function handleFlag() {
    if (!confirm("Report this listing as suspicious or fraudulent?")) return;

    await api.post(`/products/${id}/flag`, {
      reason: "Reported by community member",
    });

    alert("Thanks - our moderation team will take a look.");
  }

  if (error) return <p className="page-error">{error}</p>;
  if (!product) return <p className="page-loading">Loading...</p>;

  const isOwner =
      user &&
      product.seller &&
      String(product.seller._id) === String(user.id);

  const isAdmin = user?.role === "admin";

  return (
      <div className="page">
        {!editing ? (
            <>
              <div className="product-detail">
                <div className="product-detail-image">
                  <img
                      src={product.imageUrl || "/item%20not%20found.jpg"}
                      alt={product.title}
                  />
                </div>

                <div className="product-detail-info">
                  <h1>{product.title}</h1>

                  <p className="product-card-price large">
                    R{product.price.toFixed(2)}
                  </p>

                  <p>{product.description}</p>

                  <p className="product-meta">
                    Condition: {product.condition} &middot; Category:{" "}
                    {product.category} &middot; Stock: {product.stock}
                  </p>

                  <p className="product-meta">
                    Sold by{" "}
                    <strong>
                      {product.seller?.businessName || product.seller?.name}
                    </strong>

                    {product.seller?.ratingCount > 0 && (
                        <>
                          {" "}
                          &middot; ⭐ {product.seller.ratingAverage} (
                          {product.seller.ratingCount} reviews)
                        </>
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

                    {user && (
                        <button className="btn-link" onClick={handleFlag}>
                          Report listing
                        </button>
                    )}
                  </div>
                </div>
              </div>
            </>
        ) : (
            <form className="form-card" onSubmit={handleUpdate}>
              <h1>Edit listing</h1>

              <label>
                Title
                <input
                    required
                    value={editForm.title}
                    onChange={(e) =>
                        updateEditField("title", e.target.value)
                    }
                />
              </label>

              <label>
                Description
                <textarea
                    required
                    value={editForm.description}
                    onChange={(e) =>
                        updateEditField("description", e.target.value)
                    }
                />
              </label>

              <label>
                Price (R)
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={editForm.price}
                    onChange={(e) =>
                        updateEditField("price", e.target.value)
                    }
                />
              </label>

              <label>
                Category
                <select
                    value={editForm.category}
                    onChange={(e) =>
                        updateEditField("category", e.target.value)
                    }
                >
                  {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                  ))}
                </select>
              </label>

              <label>
                Condition
                <select
                    value={editForm.condition}
                    onChange={(e) =>
                        updateEditField("condition", e.target.value)
                    }
                >
                  {CONDITIONS.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                  ))}
                </select>
              </label>

              <label>
                Product Image
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                />
              </label>

              {uploadingImage && <p>Uploading image...</p>}

              {editForm.imageUrl && (
                  <div className="image-preview">
                    <p>Image preview:</p>

                    <img
                        src={editForm.imageUrl}
                        alt="Product preview"
                        style={{
                          width: "100%",
                          maxHeight: "300px",
                          objectFit: "contain",
                          borderRadius: "8px",
                        }}
                    />
                  </div>
              )}

              <label>
                Stock
                <input
                    type="number"
                    min="0"
                    value={editForm.stock}
                    onChange={(e) =>
                        updateEditField("stock", e.target.value)
                    }
                />
              </label>

              {editError && <p className="page-error">{editError}</p>}

              <div className="product-detail-actions">
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={saving || uploadingImage}
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>

                <button
                    type="button"
                    className="btn-link"
                    onClick={cancelEditing}
                    disabled={saving || uploadingImage}
                >
                  Cancel
                </button>
              </div>
            </form>
        )}

        <section className="reviews-section">
          <h2>Reviews ({reviews.length})</h2>

          {reviews.length === 0 && <p>No reviews yet.</p>}

          <ul className="review-list">
            {reviews.map((r) => (
                <li key={r._id} className="review-item">
                  <strong>{"⭐".repeat(r.rating)}</strong> &mdash;{" "}
                  {r.reviewer?.name || "Anonymous"}

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
                      onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            rating: Number(e.target.value),
                          })
                      }
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
                      onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            comment: e.target.value,
                          })
                      }
                  />
                </label>

                {reviewError && (
                    <p className="page-error">{reviewError}</p>
                )}

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