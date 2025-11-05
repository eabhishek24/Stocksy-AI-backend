require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const cors = require('cors');

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"], // Your React app's address
  credentials: true // To allow cookies, if you use them for auth
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const signupRoute = require("./Routes/SignupRoute");
const loginRoute = require("./Routes/LoginRoute"); 
const authRoute = require("./Routes/AuthRoute");
app.use("/", authRoute);
app.use("/", signupRoute);
app.use("/", loginRoute);

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const { HoldingsModel } = require('./models/HoldingsModel');
const { PositionModel } = require('./models/PositionModel');


app.get('/allHoldings',async(req,res)=>{
    let allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  });

app.get('/allPositions', async(req,res)=>{
    let allPositions = await PositionModel.find({});
    res.json(allPositions);
  });

app.get("/ping", (req, res) => {
  res.send("Server active ✅");
});

app.listen(PORT, async () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
  }
});


