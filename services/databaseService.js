const mongoose = require("mongoose");
const { mongoURI } = require("../config");

exports.connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      if (mongoose.connection.client.s.url !== mongoURI) {
        await mongoose.disconnect();
      } else {
        console.log("Already connected to MongoDB");
        return;
      }
    }
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
};
