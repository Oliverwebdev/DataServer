const LogEntry = require('./models/LogEntry');
const geoip = require('geoip-lite');
const morgan = require('morgan');

function basicLogging() {
    return morgan('combined', { immediate: true }, async (tokens, req, res) => {
        try {
            const geo = geoip.lookup(req.ip) || {};
            const geoInfo = {
                ip: req.ip,
                country: geo.country,
                region: geo.region,
                city: geo.city
            };

            const logEntry = new LogEntry({
                timestamp: new Date(),
                ip: req.ip,
                method: tokens.method(req, res),
                url: tokens.url(req, res),
                userAgent: tokens['user-agent'](req, res),
                referrer: tokens.referrer(req, res) || 'Keine Referenzseite',
                deviceType: req.device.type,
                geoInfo: geoInfo,
                cookies: req.cookies,
            });

            await logEntry.save();
        } catch (err) {
            console.error('Logging to DB error:', err);
        }
    });
}

async function detailedLogging(req, res, next) {
    try {
        const geo = geoip.lookup(req.ip) || {};
        const geoInfo = {
            ip: req.ip,
            country: geo.country,
            region: geo.region,
            city: geo.city
        };

        const logEntry = new LogEntry({
            timestamp: new Date(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
            userAgent: req.get('User-Agent'),
            referrer: req.get('Referrer') || 'Keine Referenzseite',
            deviceType: req.device.type,
            geoInfo: geoInfo,
            cookies: req.cookies
        });

        await logEntry.save();
    } catch (err) {
        console.error('Logging to DB error:', err);
    }
    next();
}

module.exports = { basicLogging, detailedLogging };
