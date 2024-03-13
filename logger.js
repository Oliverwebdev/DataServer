const fs = require('fs');
const path = require('path');
const geoip = require('geoip-lite');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

function basicLogging(morgan) {
    return morgan('combined', { stream: accessLogStream });
}

function detailedLogging(req, res, next) {
    const geoInfo = geoip.lookup(req.ip);
    const deviceInfo = req.device.type;
    const referrer = req.get('Referrer') || 'Keine Referenzseite';
    const userAgent = req.get('User-Agent');
    const cookies = req.cookies;

    const logEntry = `${new Date().toISOString()} - IP: ${req.ip} - Method: ${req.method} - URL: ${req.url} - User-Agent: ${userAgent} - Referrer: ${referrer} - Device: ${deviceInfo} - GeoIP: ${JSON.stringify(geoInfo)} - Cookies: ${JSON.stringify(cookies)}\n`;
    
    fs.appendFile(path.join(__dirname, 'detailed_access.log'), logEntry, (err) => {
        if (err) console.error('Logging error:', err);
    });

    next();
}

module.exports = { basicLogging, detailedLogging };
