const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => console.error('MongoDB connection error:', err));

const logSchema = new mongoose.Schema({
  timestamp: Date,
  ip: String,
  method: String,
  url: String,
  userAgent: String,
  referrer: String,
  deviceType: String,
  geoInfo: mongoose.Schema.Types.Mixed,
  cookies: mongoose.Schema.Types.Mixed,
});

const LogEntry = mongoose.model('LogEntry', logSchema);

module.exports = LogEntry;
