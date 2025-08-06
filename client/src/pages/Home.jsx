import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { runConnectionTests } from "../utils/testConnection";
import { runNetworkDiagnostics } from "../utils/networkTest";
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
  const [networkResults, setNetworkResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [networkLoading, setNetworkLoading] = useState(false);
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

  const runNetworkTests = async () => {
    setNetworkLoading(true);
    setError(null);
    setNetworkResults(null); // Clear previous results
    try {
      const results = await runNetworkDiagnostics();
      setNetworkResults(results);
      console.log("Network diagnostics results:", results);
      
      // Log detailed results to console for debugging
      console.table({
        'Direct Connection': results.directConnection.success ? 'Success' : 'Failed',
        'With Credentials': results.withCredentials.success ? 'Success' : 'Failed',
        'With Origin': results.withOrigin.success ? 'Success' : 'Failed'
      });
      
      // If all tests failed, provide additional guidance
      if (!results.directConnection.success && 
          !results.withCredentials.success && 
          !results.withOrigin.success) {
        console.warn('All network tests failed. This could indicate:');
        console.warn('1. The server is down or unreachable');
        console.warn('2. There might be network connectivity issues');
        console.warn('3. CORS might be misconfigured on the server');
        console.warn('4. The server might be starting up (common with free-tier hosting)');
      }
    } catch (err) {
      console.error("Network diagnostics error:", err);
      setError(err.message || "An error occurred during network diagnostics");
    } finally {
      setNetworkLoading(false);
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
        <div className="test-buttons">
          <button onClick={runTests} disabled={loading} className="test-btn">
            {loading ? "Testing..." : "Test API Connection"}
          </button>
          <button onClick={runNetworkTests} disabled={networkLoading} className="test-btn network-btn">
            {networkLoading ? "Running Diagnostics..." : "Run Network Diagnostics"}
          </button>
        </div>

        {error && (
          <div className="error-container">
            <h4>Error</h4>
            <p>{error}</p>
          </div>
        )}

        {testResults && (
          <div className="results-container">
            <h4>API Test Results</h4>
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

        {networkResults && (
            <div className="results-container network-results">
              <h4>Network Diagnostics Results</h4>
              <div className="result-summary">
                <p><strong>Timestamp:</strong> {new Date(networkResults.timestamp).toLocaleString()}</p>
                <p><strong>API URL:</strong> {networkResults.baseUrl}</p>
                <p><strong>Client URL:</strong> {networkResults.clientUrl}</p>
                <p><strong>Summary:</strong> {' '}
                  {networkResults.directConnection.success || networkResults.withCredentials.success || networkResults.withOrigin.success ? 
                    'At least one test succeeded. The server appears to be reachable.' : 
                    'All tests failed. The server may be down or unreachable.'}
                </p>
                {networkResults.networkInfo && networkResults.networkInfo !== 'Not available' && (
                  <div className="network-info">
                    <p><strong>Network Information:</strong></p>
                    <ul>
                      {networkResults.networkInfo.effectiveType && <li>Connection Type: {networkResults.networkInfo.effectiveType}</li>}
                      {networkResults.networkInfo.downlink && <li>Downlink: {networkResults.networkInfo.downlink} Mbps</li>}
                      {networkResults.networkInfo.rtt && <li>Round Trip Time: {networkResults.networkInfo.rtt} ms</li>}
                    </ul>
                  </div>
                )}
              </div>

            
            <div className="result-item">
              <strong>Direct Connection:</strong>
              <div className={`sub-result ${networkResults.directConnection?.success ? '' : 'error'}`}>
                <strong>Status:</strong> {networkResults.directConnection?.success ? "✅ Success" : "❌ Failed"}
                {networkResults.directConnection?.error && (
                  <div>
                    <strong>Error:</strong> {networkResults.directConnection.error.message}
                    <strong>Code:</strong> {networkResults.directConnection.error.code}
                  </div>
                )}
                {networkResults.directConnection?.data && (
                  <div>
                    <strong>Response:</strong>
                    <pre>{JSON.stringify(networkResults.directConnection.data, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>

            <div className="result-item">
              <strong>With Credentials:</strong>
              <div className={`sub-result ${networkResults.withCredentials?.success ? '' : 'error'}`}>
                <strong>Status:</strong> {networkResults.withCredentials?.success ? "✅ Success" : "❌ Failed"}
                {networkResults.withCredentials?.error && (
                  <div>
                    <strong>Error:</strong> {networkResults.withCredentials.error.message}
                  </div>
                )}
                {networkResults.withCredentials?.data && (
                  <div>
                    <strong>Response:</strong>
                    <pre>{JSON.stringify(networkResults.withCredentials.data, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>

            <div className="result-item">
              <strong>With Origin Header:</strong>
              <div className={`sub-result ${networkResults.withOrigin?.success ? '' : 'error'}`}>
                <strong>Status:</strong> {networkResults.withOrigin?.success ? "✅ Success" : "❌ Failed"}
                {networkResults.withOrigin?.corsHeaders && (
                  <div>
                    <strong>CORS Headers:</strong>
                    <pre>{JSON.stringify(networkResults.withOrigin.corsHeaders, null, 2)}</pre>
                  </div>
                )}
                {networkResults.withOrigin?.error && (
                  <div>
                    <strong>Error:</strong> {networkResults.withOrigin.error.message}
                  </div>
                )}
                {networkResults.withOrigin?.data && (
                  <div>
                    <strong>Response:</strong>
                    <pre>{JSON.stringify(networkResults.withOrigin.data, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
