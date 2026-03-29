require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const setupSwagger = require("./src/config/swagger.js");
const userRoutes = require("./src/routes/user.route.js");
const hospitalRoutes = require("./src/routes/hospital.route.js");
const articleRoutes = require("./src/routes/article.route.js");
const adminRoutes = require("./src/routes/admin.route.js");
const symptomRoutes = require("./src/routes/symptom.route.js");
const diseaseRoutes = require('./src/routes/disease.route');
const app = express();
app.use(cookieParser());

const allowedOrigins = [
  process.env.FRONTEND_URL, // This reads from your .env file
  "https://konn-yoeung-three.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser tools (curl, Postman)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS policy: origin not allowed"), false);
  },
  credentials: true,
}));

app.use(express.json());

// Symptom ML predict: no MongoDB required (Python + pickles).
app.use("/api/symptoms", symptomRoutes);

app.get("/", (req, res) => {
  res.send("KonnYoeung Backend is Running!");
});

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
    app.use('/api/diseases', diseaseRoutes);
    app.use("/api/admin",adminRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => { // Adding "0.0.0.0" helps Vultr listen correctly
  console.log(`Server running on https://konnyoeung.duckdns.org`);
  console.log(`Swagger Docs: https://konnyoeung.duckdns.org/api-docs`);
  });
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
  });