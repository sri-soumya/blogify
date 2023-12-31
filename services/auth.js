const jwt = require("jsonwebtoken");
const secret = "IMUsthelpmy$Elf";
function createUserToken(user) {
  const payload = {
    _id: user._id,
    name: user.fullName,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  const token = jwt.sign(payload, secret);
  return token;
}

function getUser(token) {
  return jwt.verify(token, secret);
}

module.exports = { createUserToken, getUser };
