import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { runConnectionTests } from "../utils/testConnection";
import API from "../api";

const Home = () => {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies.token) {
      navigate("/dashboard");
    }
  }, [cookies, navigate]);

  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runTests = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await runConnectionTests();
      setTestResults(results);
      console.log("Test results:", results);
    } catch (err) {
      console.error("Test error:", err);
      setError(err.message || "An error occurred during testing");
    } finally {
      setLoading(false);
    }
  };

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
      
      <div className="test-section">
        <h3>Connection Test</h3>
        <p>API URL: {API.defaults.baseURL || "Not configured"}</p>
        <button onClick={runTests} disabled={loading} className="test-btn">
          {loading ? "Testing..." : "Test API Connection"}
        </button>

        {error && (
          <div className="error-container">
            <h4>Error</h4>
            <p>{error}</p>
          </div>
        )}

        {testResults && (
          <div className="results-container">
            <h4>Test Results</h4>
            <div className="result-item">
              <strong>API Connection:</strong>{" "}
              {testResults.apiConnection?.success ? "✅ Success" : "❌ Failed"}
            </div>

            {testResults.apiConnection?.health && (
              <div className="result-item">
                <strong>Health Check:</strong>{" "}
                <pre>
                  {JSON.stringify(testResults.apiConnection.health, null, 2)}
                </pre>
              </div>
            )}

            {testResults.apiConnection?.cors && (
              <div className="result-item">
                <strong>CORS Test:</strong>{" "}
                <pre>
                  {JSON.stringify(testResults.apiConnection.cors, null, 2)}
                </pre>
              </div>
            )}

            {testResults.apiConnection?.error && (
              <div className="result-item error">
                <strong>Error Details:</strong>{" "}
                <pre>
                  {JSON.stringify(testResults.apiConnection.error, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
