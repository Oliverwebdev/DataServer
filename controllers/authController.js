const User = require("../models/User");
const PasswordResetToken = require("../models/PasswordResetToken");
const { transporter } = require("../services/emailService");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { jwtSecret, nodeEnv } = require("../config");

exports.registerUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }
    try {
        const user = new User({ email, password });
        await user.save();
        res.status(201).send("User registered successfully");
    } catch (error) {
        res.status(400).send("Error registering user: " + error.message);
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("Ungültige Anmeldedaten");
        }
        const isMatch = await user.isCorrectPassword(password);
        if (!isMatch) {
            return res.status(401).send("Ungültige Anmeldedaten");
        }
        const token = jwt.sign({ userId: user._id, user: user.email }, jwtSecret, { expiresIn: '1d' });
        res.cookie('jwt', token, { httpOnly: true, secure: nodeEnv === 'production' });
        res.status(200).send("Benutzer erfolgreich angemeldet");
    } catch (error) {
        res.status(500).send("Anmeldefehler: " + error.message);
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send("User not found");
    }
    const token = crypto.randomBytes(20).toString("hex");
    const passwordToken = new PasswordResetToken({ userId: user._id, token });
    await passwordToken.save();
    const mailOptions = {
        from: "oliver.sporl@dci-student.org", // Replace with your actual email
        to: user.email,
        subject: "Password Reset",
        text: `Please use the following link to reset your password: http://${req.headers.host}/reset-password/${token}`
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            res.status(500).send("Error sending email: " + err.message);
        } else {
            res.status(200).send("Password reset email sent");
        }
    });
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const passwordToken = await PasswordResetToken.findOne({ token }).populate("userId");
    if (!passwordToken) {
        return res.status(400).send("Invalid or expired token");
    }
    const user = passwordToken.userId;
    user.password = password;
    await user.save();
    await PasswordResetToken.deleteMany({ userId: user._id });
    res.status(200).send("Password has been reset successfully");
};
