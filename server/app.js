require('dotenv').config(); // Ensure this is at the very top
const express = require("express");
const mongoose = require("mongoose");
const setupSwagger = require("./config/swagger"); 
const testRoutes = require("./routes/test.route");

const app = express();
app.use(express.json());

// 1. Connect to MongoDB Atlas using the variable from your .env file
const dbURI = process.env.MONGODB_URI; 

mongoose.connect(dbURI)
  .then(() => {
    console.log("✅ MongoDB Atlas Connected Successfully");
    
    setupSwagger(app);

    app.use("/api/test", testRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📖 Docs: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error detail:", err.message);
    // This will tell us if it's a "Bad Password" or "IP Not Whitelisted" error
  });