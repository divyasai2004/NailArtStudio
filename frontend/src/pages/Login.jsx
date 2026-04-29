import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const DEFAULT_ADMIN_EMAIL = "admin@nailartstudio.com";
const DEFAULT_ADMIN_PASSWORD = "Admin@123";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginType, setLoginType] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fillAdminCredentials = () => {
    setEmail(DEFAULT_ADMIN_EMAIL);
    setPassword(DEFAULT_ADMIN_PASSWORD);
    setLoginType("admin");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      login(data);
      navigate(data?.isAdmin ? "/admin" : "/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap page-shell">
      <form className="panel stack-sm" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="login-type-toggle">
          <button
            type="button"
            className={`btn-ghost ${loginType === "user" ? "is-active" : ""}`}
            onClick={() => setLoginType("user")}
          >
            User Login
          </button>
          <button
            type="button"
            className={`btn-ghost ${loginType === "admin" ? "is-active" : ""}`}
            onClick={() => setLoginType("admin")}
          >
            Admin Login
          </button>
        </div>
        {loginType === "admin" ? (
          <div className="panel" style={{ padding: 12 }}>
            <p className="muted">Use default admin credentials or edit manually.</p>
            <button type="button" className="btn-secondary" onClick={fillAdminCredentials}>
              Use Default Admin Credentials
            </button>
            <p className="muted" style={{ marginTop: 8 }}>
              {DEFAULT_ADMIN_EMAIL} / {DEFAULT_ADMIN_PASSWORD}
            </p>
          </div>
        ) : null}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? "Hide password" : "Show password"}
        </button>
        {error ? <p className="text-danger">{error}</p> : null}
        <button className="btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p>
          New user? <Link to="/register">Create account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

