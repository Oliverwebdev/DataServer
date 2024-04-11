const mongoose = require('mongoose');

const logEntrySchema = new mongoose.Schema({
    timestamp: Date,
    ip: String,
    method: String,
    url: String,
    userAgent: String,
    referrer: String,
    deviceType: String,
    geoInfo: {
        ip: String,
        country: String,
        region: String,
        city: String
    },
    cookies: Map
}, { minimize: false });

const LogEntry = mongoose.model('LogEntry', logEntrySchema);

module.exports = LogEntry;
