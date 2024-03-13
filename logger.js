const LogEntry = require('./db');
const geoip = require('geoip-lite');
const morgan = require('morgan');

function basicLogging(morgan) {
    return morgan('combined', async (tokens, req, res) => {
        try {
            // Für Debugging-Zwecke: IP-Adresse loggen
            console.log('IP Address:', req.ip);
            
            // Beispiel: Verwende eine feste öffentliche IP für das Testen (entfernen für Produktion)
            const testIp = '8.8.8.8'; // Google Public DNS IP
            const geoInfo = geoip.lookup(testIp);
            
            // Für Debugging-Zwecke: Geo-Informationen loggen
            console.log('GeoInfo:', geoInfo);

            const logEntry = new LogEntry({
                timestamp: new Date(),
                ip: req.ip,
                method: tokens.method(req, res),
                url: tokens.url(req, res),
                userAgent: tokens['user-agent'](req, res),
                referrer: tokens.referrer(req, res) || 'Keine Referenzseite',
                deviceType: req.device.type,
                geoInfo: geoInfo,
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
        // Direktes Loggen der aktuellen Client-IP
        console.log('IP Address:', req.ip);

        const geoInfo = geoip.lookup(req.ip);
        
        // Loggen der Geo-Informationen basierend auf der Client-IP
        console.log('GeoInfo:', geoInfo);

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
