import { useState } from "react";
import { Link } from "react-router-dom";
import { customRequestApi } from "../api/customRequestApi";
import { useAuth } from "../context/AuthContext";

const SHAPES = ["Almond", "Coffin", "Square", "Stiletto", "Oval", "Squoval"];
const SIZES = ["XS", "S", "M", "L", "Custom Measurements"];
const LENGTHS = ["Short", "Medium", "Long", "Extra Long"];

const CustomDesign = () => {
  const { authUser } = useAuth();

  const [form, setForm] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
    shape: "Almond",
    size: "M",
    measurements: "",
    length: "Medium",
    baseColor: "",
    description: "",
    referenceImage: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await customRequestApi.createRequest(form);
      setSuccess(true);
      setForm({
        ...form,
        measurements: "",
        baseColor: "",
        description: "",
        referenceImage: "",
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit custom request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .custom-design-page {
          padding: 60px 16px;
          background: var(--parchment);
          min-height: calc(100vh - var(--nav-h));
        }
        .custom-design-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .custom-design-header h1 {
          font-family: var(--ff-serif);
          font-size: clamp(2rem, 5vw, 3rem);
          color: var(--crimson);
          margin-bottom: 12px;
        }
        .custom-design-header p {
          color: var(--muted);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .custom-design-container {
          max-width: 800px;
          margin: 0 auto;
          background: var(--white);
          padding: clamp(24px, 5vw, 48px);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px 14px;
          border: 1.5px solid var(--blush);
          border-radius: var(--radius-sm);
          font-family: var(--ff-sans);
          font-size: 0.95rem;
          color: var(--text);
          background: var(--cream);
          transition: all 0.2s;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: var(--crimson);
          outline: none;
          background: var(--white);
          box-shadow: 0 0 0 3px rgba(139, 44, 56, 0.1);
        }
        .submit-btn {
          width: 100%;
          padding: 16px;
          background: var(--brand-primary-gradient);
          color: var(--white);
          border: none;
          border-radius: var(--radius-full);
          font-family: var(--ff-sans);
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 10px;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .success-banner {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #16a34a;
          padding: 24px;
          border-radius: var(--radius-md);
          text-align: center;
          margin-bottom: 24px;
        }
        .success-banner h3 {
          margin-bottom: 8px;
          font-family: var(--ff-serif);
          font-size: 1.5rem;
        }
        .error-banner {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 16px;
          border-radius: var(--radius-sm);
          margin-bottom: 24px;
        }
      `}</style>

      <div className="custom-design-page">
        <div className="custom-design-header">
          <h1>Custom Design Request</h1>
          <p>
            Dreaming of a unique set of nails? Tell us exactly what you want,
            and our artists will bring your vision to life. Fill out the details below
            to get started.
          </p>
        </div>

        <div className="custom-design-container">
          {success ? (
            <div className="success-banner">
              <h3>Request Submitted! 🎉</h3>
              <p>
                Thank you for your custom design request. Our team will review your
                requirements and get back to you via email shortly.
              </p>
              <div style={{ marginTop: 24 }}>
                <Link to="/" className="nh-btn-ghost">
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className="error-banner">{error}</div>}

              <div className="form-grid">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Nail Shape *</label>
                  <select name="shape" value={form.shape} onChange={onChange} required>
                    {SHAPES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Length *</label>
                  <select name="length" value={form.length} onChange={onChange} required>
                    {LENGTHS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Nail Size *</label>
                  <select name="size" value={form.size} onChange={onChange} required>
                    {SIZES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Base Color *</label>
                  <input
                    name="baseColor"
                    value={form.baseColor}
                    onChange={onChange}
                    required
                    placeholder="e.g. Nude, Black, Pastel Pink"
                  />
                </div>
              </div>

              {form.size === "Custom Measurements" && (
                <div className="form-group">
                  <label>Custom Measurements (in mm) *</label>
                  <input
                    name="measurements"
                    value={form.measurements}
                    onChange={onChange}
                    required={form.size === "Custom Measurements"}
                    placeholder="Thumb, Index, Middle, Ring, Pinky (e.g., 16, 12, 13, 12, 9)"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Design Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  required
                  rows={5}
                  placeholder="Describe your desired design in detail. Include patterns, finishes (matte/glossy), 3D elements, rhinestones, etc."
                />
              </div>

              <div className="form-group">
                <label>Reference Image URL (Optional)</label>
                <input
                  name="referenceImage"
                  value={form.referenceImage}
                  onChange={onChange}
                  placeholder="Link to a picture of what you want (e.g., Pinterest, Google Drive, Imgur)"
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Submitting Request..." : "Submit Custom Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomDesign;
