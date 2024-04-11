const device = require("device");
const useragent = require("express-useragent");

const setDeviceMiddleware = (req, res, next) => {
  req.device = device(req.headers["user-agent"]);
  next();
};

module.exports = {
  useragent: useragent.express(),
  setDeviceMiddleware
};
