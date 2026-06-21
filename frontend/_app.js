const express = require("express");
const cors = require("cors");
const connectDB = require("../backend/config/db");

const app = express();

if (process.env.MONGO_URI) {
  connectDB().catch((err) => console.error("MongoDB connection error:", err.message));
}

app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
  next();
});

app.use("/api/auth", require("../backend/routes/authRoutes"));
app.use("/api/products", require("../backend/routes/productRoutes"));
app.use("/api/categories", require("../backend/routes/categoryRoutes"));
app.use("/api/settings", require("../backend/routes/settingsRoutes"));
app.use("/api/orders", require("../backend/routes/orderRoutes"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", environment: process.env.NODE_ENV || "production" });
});

app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

module.exports = app;
