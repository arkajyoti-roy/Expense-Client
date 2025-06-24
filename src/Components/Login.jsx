import { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "./url";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 2) {
      newErrors.password = "Password must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/users/login`, {
        email: formData.email,
        password: formData.password
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      console.log("Login successful, token stored:", token);

      // Navigate to /home instantly
      navigate("/");
    } catch (error) {
      const errMsg = error.response?.data?.message || "Login failed. Please try again.";
      setErrors({ general: errMsg });
      console.error("Login error:", errMsg);
    } finally {
      setIsLoading(false);
      navigate("/");

    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon">💰</div>
            <h1>ExpenseTracker</h1>
          </div>
          <p className="subtitle">
            Welcome back! Please sign in to your account
          </p>
        </div>

        <div className="login-form">
          {errors.general && (
            <div className="error-message general-error" style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px',
              border: '1px solid #fecaca'
            }}>
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? "error" : ""}
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? "error" : ""}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <button type="button" className="link-btn">
              Forgot password?
            </button>
          </div>

          <button
            type="button"
            className={`submit-btn ${isLoading ? "loading" : ""}`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </div>

        <div className="form-footer">
          <p>
            Don't have an account?
            <button type="button" className="signup-link">
              Contact Admin
            </button>
          </p>
        </div>

        <div className="features">
          <div className="feature">
            <span className="feature-icon">📊</span>
            <span>Track Expenses</span>
          </div>
          <div className="feature">
            <span className="feature-icon">💡</span>
            <span>Smart Insights</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🎯</span>
            <span>Budget Goals</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;