// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import API from "../api";
// import { ToastContainer, toast } from "react-toastify";

// const Signup = () => {
//   const navigate = useNavigate();
//   const [inputValue, setInputValue] = useState({
//     email: "",
//     password: "",
//     username: "",
//   });

//   const { email, password, username } = inputValue;

//   const handleOnChange = (e) => {
//     const { name, value } = e.target;
//     setInputValue((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleError = (err) =>
//     toast.error(err, { position: "bottom-left" });

//   const handleSuccess = (msg) =>
//     toast.success(msg, { position: "bottom-right" });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("🔄 Signup attempt with:", { email, username, password: "***" });
    
//     try {
//       console.log("📡 Making API request to /api/signup");
//       const { data } = await API.post("/api/signup", { ...inputValue });
//       console.log("📥 Received response:", data);

//       const { success, message } = data;
//       if (success) {
//         handleSuccess(message);
//         setTimeout(() => navigate("/dashboard"), 1000);
//       } else {
//         handleError(message);
//       }
//     } catch (error) {
//       console.error("❌ Signup error:", error);
//       console.error("❌ Error details:", {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//         config: error.config
//       });
      
//       if (error.response) {
//         // Server responded with error
//         handleError(error.response.data.message || "Signup failed");
//       } else if (error.request) {
//         // Network error
//         handleError("Network error. Please check your connection.");
//       } else {
//         // Other error
//         handleError("Something went wrong. Please try again.");
//       }
//     }

//     setInputValue({ email: "", password: "", username: "" });
//   };

//   return (
//     <div className="form_container">
//       <h2>Signup Account</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={email}
//             placeholder="Enter your email"
//             onChange={handleOnChange}
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="username">Username</label>
//           <input
//             type="text"
//             name="username"
//             value={username}
//             placeholder="Enter your username"
//             onChange={handleOnChange}
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="password">Password</label>
//           <input
//             type="password"
//             name="password"
//             value={password}
//             placeholder="Enter your password"
//             onChange={handleOnChange}
//             required
//           />
//         </div>

//         <button type="submit">Submit</button>
//         <span>
//           Already have an account? <Link to="/login">Login</Link>
//         </span>
//       </form>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Signup;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });
  const { email, password, username } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const handleError = (err) =>
    toast.error(err, { position: "bottom-left" });
  const handleSuccess = (msg) =>
    toast.success(msg, { position: "bottom-right" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/signup`,
        { ...inputValue },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.error(error);
      handleError("Something went wrong. Please try again.");
    }
    setInputValue({ email: "", password: "", username: "" });
  };

  return (
    <div className="form_container">
      <h2>Signup Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Enter your username"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
          />
        </div>
        <button type="submit">Submit</button>
        <span>
          Already have an account? <Link to={"/login"}>Login</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Signup;
