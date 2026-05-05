import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authApi.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      // FIX #1: Do NOT auto-login. Show success and redirect to login.
      setSuccess(true);
      setTimeout(() => navigate("/login", { state: { registered: true } }), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .auth-page {
          min-height: calc(100vh - 68px);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--parchment);
          padding: 40px 16px;
        }
        .auth-card {
          background: var(--white);
          width: 100%;
          max-width: 440px;
          padding: clamp(32px, 5vw, 52px) clamp(24px, 5vw, 44px);
          box-shadow: var(--shadow-md);
        }
        .auth-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
        }
        .auth-brand-dot {
          width: 28px;
          height: 28px;
          background: var(--crimson);
          border-radius: 50%;
          flex-shrink: 0;
        }
        .auth-brand-name {
          font-family: var(--ff-serif);
          font-size: 1.4rem;
          font-weight: 400;
          color: var(--crimson);
          letter-spacing: 0.01em;
        }
        .auth-title {
          font-family: var(--ff-serif);
          font-size: clamp(1.8rem, 4vw, 2.4rem);
          font-weight: 300;
          color: var(--crimson);
          margin-bottom: 6px;
        }
        .auth-sub {
          font-size: 0.85rem;
          color: var(--muted);
          margin-bottom: 28px;
        }
        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }
        .auth-field label {
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .auth-field input {
          border: 1.5px solid var(--blush);
          padding: 12px 14px;
          font-family: var(--ff-sans);
          font-size: 0.92rem;
          color: var(--text);
          background: var(--cream);
          outline: none;
          transition: border-color 0.2s;
          border-radius: 2px;
        }
        .auth-field input:focus { border-color: var(--crimson); background: var(--white); }
        .auth-field input.has-error { border-color: #c0392b; }
        .pw-wrap { position: relative; }
        .pw-wrap input { width: 100%; padding-right: 80px; }
        .pw-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
          cursor: pointer;
          padding: 4px;
        }
        .pw-toggle:hover { color: var(--crimson); }
        .auth-error {
          background: #fef2f2;
          border-left: 3px solid #c0392b;
          padding: 10px 14px;
          font-size: 0.84rem;
          color: #c0392b;
          margin-bottom: 16px;
          border-radius: 0 2px 2px 0;
        }
        .auth-success {
          background: #f0fdf4;
          border-left: 3px solid #16a34a;
          padding: 14px 16px;
          font-size: 0.88rem;
          color: #16a34a;
          margin-bottom: 16px;
          border-radius: 0 2px 2px 0;
        }
        .auth-success strong { display: block; font-size: 0.95rem; margin-bottom: 4px; }
        .auth-btn-primary {
          width: 100%;
          padding: 14px;
          background: var(--crimson);
          color: var(--cream);
          border: none;
          font-family: var(--ff-sans);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.25s, transform 0.2s;
          margin-bottom: 16px;
        }
        .auth-btn-primary:hover:not(:disabled) { background: var(--rose); transform: translateY(-1px); }
        .auth-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
        .auth-footer {
          text-align: center;
          font-size: 0.85rem;
          color: var(--muted);
        }
        .auth-footer a {
          color: var(--crimson);
          font-weight: 500;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .auth-divider {
          height: 1px;
          background: var(--blush);
          margin: 20px 0;
        }
        .strength-bar {
          height: 3px;
          background: var(--blush);
          border-radius: 2px;
          margin-top: 6px;
          overflow: hidden;
        }
        .strength-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.3s, background 0.3s;
        }
      `}</style>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="auth-brand-dot" />
            <span className="auth-brand-name">NailArt Studio</span>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-sub">Join thousands of happy customers 💅</p>

          {success ? (
            <div className="auth-success">
              <strong>Account created successfully! 🎉</strong>
              Redirecting you to login…
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {error && <div className="auth-error">{error}</div>}

              <div className="auth-field">
                <label htmlFor="reg-name">Full Name</label>
                <input
                  id="reg-name"
                  name="name"
                  placeholder="Priya Sharma"
                  value={form.name}
                  onChange={onChange}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="reg-email">Email Address</label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={onChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="reg-password">Password</label>
                <div className="pw-wrap">
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={onChange}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setShowPassword((p) => !p)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {form.password && (
                  <div className="strength-bar">
                    <div
                      className="strength-bar-fill"
                      style={{
                        width: `${Math.min(100, (form.password.length / 12) * 100)}%`,
                        background: form.password.length < 6 ? "#e74c3c" : form.password.length < 10 ? "#f39c12" : "#16a34a",
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="auth-field">
                <label htmlFor="reg-confirm">Confirm Password</label>
                <div className="pw-wrap">
                  <input
                    id="reg-confirm"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={onChange}
                    required
                    className={form.confirmPassword && form.confirmPassword !== form.password ? "has-error" : ""}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="auth-divider" />

              <button className="auth-btn-primary" disabled={loading}>
                {loading ? "Creating account…" : "Create Account →"}
              </button>

              <div className="auth-footer">
                Already have an account?{" "}
                <Link to="/login">Sign in here</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Register;
