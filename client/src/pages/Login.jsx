import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, { position: "bottom-left" });

  const handleSuccess = (msg) =>
    toast.success(msg, { position: "bottom-left" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔄 Login attempt with:", { email, password: "***" });
    
    try {
      // First, test if the server is reachable
      console.log("🔍 Testing server connectivity...");
      try {
        const healthCheck = await API.get("/health");
        console.log("✅ Server is reachable:", healthCheck.data);
      } catch (healthError) {
        console.error("❌ Server health check failed:", healthError);
      }
      
      console.log("📡 Making API request to /api/login");
      const { data } = await API.post("/api/login", { ...inputValue });
      console.log("📥 Received response:", data);

      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      console.error("❌ Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      if (error.response) {
        // Server responded with error
        handleError(error.response.data.message || "Login failed");
      } else if (error.request) {
        // Network error
        handleError("Network error. Please check your connection.");
      } else {
        // Other error
        handleError("Something went wrong. Please try again.");
      }
    }

    setInputValue({ email: "", password: "" });
  };

  return (
    <div className="form_container">
      <h2>Login Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
            required
          />
        </div>

        <button type="submit">Submit</button>
        <span>
          Don’t have an account? <Link to="/signup">Signup</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
