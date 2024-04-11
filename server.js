const express = require("express");
const path = require("path");
const { port } = require("./config");
const { connectToDatabase } = require("./services/databaseService");
const authRoutes = require("./routes/authRoutes");
const { useragent, setDeviceMiddleware } = require("./middleware/customMiddleware");
const { basicLogging, detailedLogging } = require('./logger');


const app = express();

app.use(express.json());
app.use(require("cookie-parser")());
app.use(useragent);
app.use(setDeviceMiddleware);

// Static files
app.use(express.static('public'));

// Main Page Endpoint
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Login Page Endpoint
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Registration Page Endpoint
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register.html"));
});

// Forgot Password Page Endpoint
app.get("/forgot-password", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "forgot-password.html"));
});

// Reset Password Page Endpoint
app.get("/reset-password/:token", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "reset-password.html"));
});

app.use(authRoutes);


app.use(detailedLogging);

connectToDatabase();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
