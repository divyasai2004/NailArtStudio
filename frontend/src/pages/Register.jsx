import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await authApi.register(form);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-wrap page-shell">
      <form className="panel stack-sm" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <input name="name" placeholder="Name" onChange={onChange} required />
        <input name="email" placeholder="Email" type="email" onChange={onChange} required />
        <input
          name="password"
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          onChange={onChange}
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
        <button className="btn-primary">Register</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

