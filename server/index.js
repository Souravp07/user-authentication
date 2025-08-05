// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const app = express();
// require("dotenv").config();
// const cookieParser = require("cookie-parser");
// const authRoute = require("./Routes/AuthRoute");
// const { MONGO_URL, PORT } = process.env;

// mongoose
//   .connect(MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB is  connected successfully"))
//   .catch((err) => console.error(err));

// app.listen(PORT, () => {
//   console.log(`Server is listening on port ${PORT}`);
// });

// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );
// app.use(cookieParser());

// app.use(express.json());

// app.use("/", authRoute);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const authRoute = require("./Routes/AuthRoute");

const { MONGO_URL, PORT } = process.env;

// MongoDB connection
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local frontend
      "https://user-auth-sp.vercel.app", // your vercel domain (removed trailing slash)
      "https://user-auth-sp.vercel.app/", // with trailing slash
      process.env.FRONTEND_URL, // from environment variable
    ].filter(Boolean), // remove undefined values
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    cors: req.headers.origin,
  });
});

// Routes
app.use("/", authRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Start server
const serverPort = PORT || 5000; // Render assigns PORT automatically
app.listen(serverPort, () => {
  console.log(`🚀 Server running on port ${serverPort}`);
  console.log(`🔗 Health check: http://localhost:${serverPort}/health`);
});
