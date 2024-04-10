// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const device = require("device");
const useragent = require("express-useragent");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const app = express();
const request = require("supertest");

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(useragent.express());
app.use((req, res, next) => {
  req.device = device(req.headers["user-agent"]);
  next();
});


async function connectToDatabase() {
  const dbURI = process.env.MONGO_URI; // Standard URI für Produktionsdatenbank
  try {
    // Überprüfen, ob bereits eine Verbindung besteht
    if (mongoose.connection.readyState === 1) {
      if (mongoose.connection.client.s.url !== dbURI) {
        // Wenn verbunden, aber falsche DB, Verbindung trennen
        await mongoose.disconnect();
      } else {
        // Wenn bereits zur richtigen DB verbunden, nichts tun
        console.log("Already connected to MongoDB");
        return;
      }
    }

    // Verbindung zur Datenbank herstellen
    await mongoose.connect(dbURI, {
      
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
}

// Verbindung initialisieren
connectToDatabase();

// User model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  dAdmin: { type: Boolean, default: true },
});
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
const User = mongoose.model("User", userSchema);

// PasswordResetToken model
const passwordResetTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // Token expires after 1 hour
});
const PasswordResetToken = mongoose.model(
  "PasswordResetToken",
  passwordResetTokenSchema
);

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD },
});

// Registration endpoint (post request)
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(400).send("Error registering user: " + error.message);
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.isCorrectPassword(password))) {
      return res.status(401).send("Invalid credentials");
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("jwt", token, { httpOnly: true, secure: true });
    res.status(200).send("User logged in successfully");
  } catch (error) {
    res.status(500).send("Login error: " + error.message);
  }
});

// Forgot password endpoint
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send("User not found");
  }
  const token = crypto.randomBytes(20).toString("hex");
  const passwordToken = new PasswordResetToken({ userId: user._id, token });
  await passwordToken.save();
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: user.email,
    subject: "Password Reset",
    text: `Please use the following link to reset your password: http://${req.headers.host}/reset-password/${token}`,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      res.status(500).send("Error sending email: " + err.message);
    } else {
      res.status(200).send("Password reset email sent");
    }
  });
});

// Reset password endpoint
app.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const passwordToken = await PasswordResetToken.findOne({ token }).populate(
      "userId"
    );
    if (!passwordToken) {
      return res.status(400).send("Invalid or expired token");
    }
    const user = passwordToken.userId;
    user.password = password;
    await user.save();
    await PasswordResetToken.deleteMany({ userId: user._id }); // Cleanup all tokens
    res.status(200).send("Password has been reset successfully");
  } catch (error) {
    res.status(500).send("Reset password error: " + error.message);
  }
});

// get endpoints

// Static pages endpoints
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});
app.get("/forgot-password", (req, res) => {
  res.sendFile(__dirname + "/public/forgot-password.html");
});
app.get("/reset-password/:token", (req, res) => {
  res.sendFile(__dirname + "/public/reset-password.html");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, mongoose };
