const { getUser } = require("../services/auth");

function checkForUserAuthentication(req, res, next) {
  const token = req.cookies["token"];
  if (!token) return next();
  try {
    const payload = getUser(token);
    req.user = payload;
  } catch (e) {}
  next();
}

module.exports = { checkForUserAuthentication };
