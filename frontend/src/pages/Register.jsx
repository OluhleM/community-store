import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    businessName: "",
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
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page page-narrow">
      <h1>Create an account</h1>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>
          Full name
          <input required value={form.name} onChange={(e) => update("name", e.target.value)} />
        </label>
        <label>
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
          <small>Use your university email to get auto-verified as a student/faculty.</small>
        </label>
        <label>
          Password
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
          />
        </label>
        <label>
          I am a...
          <select value={form.role} onChange={(e) => update("role", e.target.value)}>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="vendor">Vendor</option>
            <option value="resident">Resident</option>
          </select>
        </label>
        {form.role === "vendor" && (
          <label>
            Business name
            <input
              value={form.businessName}
              onChange={(e) => update("businessName", e.target.value)}
            />
          </label>
        )}
        {error && <p className="page-error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
