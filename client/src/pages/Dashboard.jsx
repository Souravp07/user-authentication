import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/");
        return;
      }

      try {
        const { data } = await axios.post(
          "http://localhost:4000",
          {},
          { withCredentials: true }
        );
        const { status, user } = data;
        setUsername(user);
        if (status) {
          toast.success(`Welcome back, ${user}!`);
          setIsVisible(true);
        } else {
          removeCookie("token");
          navigate("/");
        }
      } catch (err) {
        console.error(err);
        removeCookie("token");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const logout = () => {
    removeCookie("token");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className={`dashboard-container ${isVisible ? 'fade-in' : ''}`}>
        <div className="dashboard-card">
          <div className="welcome-header">
            <div className="avatar">
              <span>{username.charAt(0).toUpperCase()}</span>
            </div>
            <h1 className="welcome-title">
              Welcome back, <span className="username-highlight">{username}</span>!
            </h1>
            <p className="welcome-subtitle">You're successfully logged in to your account.</p>
          </div>
          
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <h3>Dashboard</h3>
                <p>Your personal space</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔒</div>
                <h3>Secure</h3>
                <p>Your data is protected</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <h3>Fast</h3>
                <p>Lightning quick access</p>
              </div>
            </div>
          </div>

          <div className="dashboard-actions">
            <button onClick={logout} className="logout-button">
              <span className="logout-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Dashboard; 