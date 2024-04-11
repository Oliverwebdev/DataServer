const nodemailer = require("nodemailer");
const { emailUser, emailPass } = require("../config");

exports.transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: emailUser, pass: emailPass }
});
