const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Registration endpoint
router.post("/register", authController.registerUser);

// Login endpoint
router.post("/login", authController.loginUser);

// Forgot password endpoint
router.post("/forgot-password", authController.forgotPassword);

// Reset password endpoint
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
