const LogEntry = require('./db'); 
const geoip = require('geoip-lite');

function basicLogging(morgan) {
    return morgan('combined', async (tokens, req, res) => {
        try {
            const logEntry = new LogEntry({
                timestamp: new Date(),
                ip: req.ip,
                method: tokens.method(req, res),
                url: tokens.url(req, res),
                userAgent: tokens['user-agent'](req, res),
                referrer: tokens.referrer(req, res) || 'Keine Referenzseite',
                deviceType: req.device.type,
                geoInfo: geoip.lookup(req.ip),
                cookies: req.cookies
            });

            await logEntry.save();
        } catch (err) {
            console.error('Logging to DB error:', err);
        }
        return null;
    });
}

async function detailedLogging(req, res, next) {
    try {
        const geoInfo = geoip.lookup(req.ip);
        const deviceInfo = req.device.type;
        const referrer = req.get('Referrer') || 'Keine Referenzseite';
        const userAgent = req.get('User-Agent');
        const cookies = req.cookies;

        const logEntry = new LogEntry({
            timestamp: new Date(),
            ip: req.ip,
            method: req.method,
            url: req.url,
            userAgent: userAgent,
            referrer: referrer,
            deviceType: deviceInfo,
            geoInfo: geoInfo,
            cookies: cookies
        });

        await logEntry.save();
    } catch (err) {
        console.error('Logging to DB error:', err);
    }
    next();
}

module.exports = { basicLogging, detailedLogging };
