require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const setupSwagger = require("../server/src/config/swagger");
const userRoutes = require("./src/routes/user.route.js");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas Connected");

    // Swagger
    setupSwagger(app);

    // Routes
    app.use("/api/users", userRoutes);

    // Root
    app.get("/", (req, res) => {
      res.send("KonnYoeung Backend is Running!");
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📖 Swagger Docs: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
