import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import { listUsers } from "../api/users";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      // GET http://localhost:8080/users
      const res = await listUsers();
      const users = Array.isArray(res.data) ? res.data : [];

      // Match user
      const match = users.find(u =>
        String(u.email || '').toLowerCase() === formData.email.toLowerCase() &&
        String(u.password || '') === formData.password
      );

      if (!match) {
        alert("Invalid email or password");
        return;
      }

      // Save user to context
      login({
        id: match.userId ?? match.id,
        username: match.username,
        email: match.email,
      });

      // Redirect to landing page
      navigate("/landing");
    } catch (err) {
      console.error("Login error:", err);
      alert("Unable to connect to backend. Is Spring Boot running on port 8080?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">

      {/* LEFT SIDE */}
      <div className="login-left">
        <div className="login-form-wrapper">

          {/* Logo / Title */}
          <div className="login-header">
            <div className="login-logo">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="#6366F1"/>
                <path d="M15 12h10M15 20h10M15 28h6"
                      stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="login-title">Notes App</h1>
            <p className="login-subtitle">Login to your account</p>
          </div>

          {/* FORM */}
          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="input-group">
              <label className="input-label">
                <svg className="input-icon" width="16" height="16"
                     viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16v12H4V4z" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="22,6 12,13 2,6" 
                            stroke="currentColor" strokeWidth="2"/>
                </svg>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </label>
            </div>

            {/* Password */}
            <div className="input-group">
              <label className="input-label">
                <svg className="input-icon" width="16" height="16"
                     viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2"
                        stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="16" r="1" fill="currentColor" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />

                {/* Toggle show password */}
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    {showPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20 
                        c-7 0-11-8-11-8a18.45 18.45 0 0 1 
                        5.06-5.94" stroke="currentColor" strokeWidth="2"/>
                        <path d="m1 1 22 22" stroke="currentColor" strokeWidth="2"/>
                      </>
                    ) : (
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            stroke="currentColor" strokeWidth="2" />
                    )}
                  </svg>
                </button>
              </label>
            </div>

            {/* Options */}
            <div className="login-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <button type="button" className="forgot-link">
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Register Switch */}
          <div className="login-switch">
            Not a member?{" "}
            <button 
              className="switch-link"
              onClick={() => navigate("/register")}
            >
              Create New Account
            </button>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="hero-content">
          <h2 className="hero-title">Welcome to Notes App</h2>
          <p className="hero-description">
            Organize your thoughts, ideas, and tasks in one beautiful place.
          </p>
          <div className="hero-features">
            <div className="feature">Easy to use interface</div>
            <div className="feature">Organize with colors</div>
            <div className="feature">Secure and private</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
