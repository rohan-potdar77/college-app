const jwt = require("jsonwebtoken");
const secretKey = "ldskjr9M8Nrxq5iyK3";
const expiresIn = "30m";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (error, user) => {
    if (error) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, secretKey, {
    expiresIn: expiresIn,
  });
}

module.exports = { authenticateToken, generateToken };
