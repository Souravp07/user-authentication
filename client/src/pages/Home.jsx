import React from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const [cookies] = useCookies([]);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (cookies.token) {
      navigate("/dashboard");
    }
  }, [cookies.token, navigate]);

  return (
    <div className="home_page">
      <div className="welcome-section">
        <h1>Welcome to User Authentication</h1>
        <p>Please choose an option to continue</p>
      </div>
      <div className="auth-buttons">
        <Link to="/login" className="auth-btn login-btn">
          Login
        </Link>
        <Link to="/signup" className="auth-btn signup-btn">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;
