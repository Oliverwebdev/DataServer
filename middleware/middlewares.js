const cookieParser = require('cookie-parser');
const device = require('express-device');

function initMiddlewares(app) {
    app.use(cookieParser());
    app.use(device.capture());
}

module.exports = initMiddlewares;
