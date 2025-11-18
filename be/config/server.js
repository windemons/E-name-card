const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const app = express();

const port = 3000;

// middlewares
app.use(express.json());

// MongoDB URI
const uri = 'mongodb+srv://duyminh111:09032002@cluster0.qg7vz.mongodb.net/Enamecard';

// Connect DB
async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  }
}

connectDB();

// Test route
app.get('/', (req, res) => {
  res.send("Server đang chạy và đã kết nối MongoDB!");
});

app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Lấy tất cả user

        res.json(users);

    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
});

