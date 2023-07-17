const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Token not provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }

    // Token is valid, store the user information in the request object
    req.user = decoded;
    next();
  });
};

module.exports = { authenticateToken };
