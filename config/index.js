require("dotenv").config();

module.exports = {
  mongoURI: process.env.MONGO_URI,
  emailUser: process.env.EMAIL_USERNAME,
  emailPass: process.env.EMAIL_PASSWORD,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT || 3000
};
