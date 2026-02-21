require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const setupSwagger = require("./src/config/swagger.js");
const userRoutes = require("./src/routes/user.route.js");
const hospitalRoutes = require("./src/routes/hospital.route.js");
const articleRoutes = require("./src/routes/article.route.js");
const disease = require("./src/models/Disease");

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas Connected");
    // Swagger
    setupSwagger(app);

    // Routes
    app.use("/api/users", userRoutes);
    app.use('/api/hospitals', hospitalRoutes);
    app.use("/api/articles", articleRoutes);

    // Root
    app.get("/", (req, res) => {
      res.send("KonnYoeung Backend is Running!");
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
  });