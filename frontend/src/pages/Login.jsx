import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Show success message if redirected from register
  const fromRegister = location.state?.registered;
  const redirectTo = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authApi.login({ email: email.trim(), password });
      login(data);
      // Admins are silently detected by isAdmin flag — no visible toggle needed
      navigate(data?.isAdmin ? "/admin" : redirectTo);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password.");
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
        .auth-notice {
          background: #f0fdf4;
          border-left: 3px solid #16a34a;
          padding: 10px 14px;
          font-size: 0.84rem;
          color: #16a34a;
          margin-bottom: 20px;
          border-radius: 0 2px 2px 0;
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
        .auth-divider { height: 1px; background: var(--blush); margin: 20px 0; }
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
      `}</style>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-brand" style={{ justifyContent: "center", marginBottom: "24px" }}>
            <img src="/logo.jpeg" alt="Logo" style={{ height: "60px", width: "auto", objectFit: "contain", borderRadius: "50%" }} />
            <span className="auth-brand-name" style={{ marginLeft: "12px" }}>Dreamy nails</span>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-sub">Sign in to your account to continue</p>

          {/* FIX #3: No admin/user toggle visible. Admins just log in normally. */}
          {fromRegister && (
            <div className="auth-notice">
              ✓ Account created! Please sign in to continue.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {error && <div className="auth-error">{error}</div>}

            <div className="auth-field">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <div className="pw-wrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="auth-divider" />

            <button className="auth-btn-primary" disabled={loading}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>

            <div className="auth-footer">
              New to Dreamy nails?{" "}
              <Link to="/register">Create a free account</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
