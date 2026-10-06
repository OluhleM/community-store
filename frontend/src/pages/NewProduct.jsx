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
  const [uploadingImage, setUploadingImage] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");

    // Extra check to make sure the selected file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
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

      update("imageUrl", data.secure_url);
    } catch (err) {
      setError(err.message || "Could not upload image");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    setSubmitting(true);

    try {
      const res = await api.post("/products", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });

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
            <input
                required
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
            />
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
            <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
              ))}
            </select>
          </label>

          <label>
            Condition
            <select
                value={form.condition}
                onChange={(e) => update("condition", e.target.value)}
            >
              {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
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

          {form.imageUrl && (
              <div className="image-preview">
                <p>Image preview:</p>
                <img
                    src={form.imageUrl}
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
                value={form.stock}
                onChange={(e) => update("stock", e.target.value)}
            />
          </label>

          {error && <p className="page-error">{error}</p>}

          <button
              type="submit"
              className="btn-primary"
              disabled={submitting || uploadingImage}
          >
            {submitting ? "Publishing..." : "Publish listing"}
          </button>
        </form>
      </div>
  );
}