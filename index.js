require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const requireAuth = require('./middleware/requireAuth');

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL,
        process.env.DASHBOARD_URL,
        process.env.VOICE_ASSISTANT_URL
      ].filter(Boolean) // Remove undefined values
    : ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const signupRoute = require("./Routes/SignupRoute");
const loginRoute = require("./Routes/LoginRoute"); 
const authRoute = require("./Routes/AuthRoute");

app.use('/login', limiter);
app.use('/signup', limiter);

app.use("/", authRoute);
app.use("/", signupRoute);
app.use("/", loginRoute);


const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const { HoldingsModel } = require('./models/HoldingsModel');
const { PositionModel } = require('./models/PositionModel');


app.get('/allHoldings', requireAuth, async(req,res)=>{
  try {
    let allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/allPositions', requireAuth, async(req,res)=>{
  try {
    let allPositions = await PositionModel.find({});
    res.json(allPositions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/ping", (req, res) => {
  res.send("Server active ✅");
});

// Add after all routes, before app.listen
// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: process.env.NODE_ENV === 'production' 
      ? "Internal server error" 
      : err.message 
  });
});

app.listen(PORT, async () => {
  try {
    await mongoose.connect(uri, {
      // Add connection options for production
      retryWrites: true,
      w: 'majority'
    });
    console.log(`✅ Connected to MongoDB`);
    console.log(`Backend server is running on port ${PORT}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1); // Exit if DB connection fails
  }
}); 


