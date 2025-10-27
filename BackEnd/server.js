require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,               
  allowedHeaders: ["Content-Type", "Authorization"], 
}));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);  
app.use("/books", bookRoutes);
app.use("/users", userRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("DB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
