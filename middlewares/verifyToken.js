const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Unauthorized Access. First Login" });

  jwt.verify(token, process.env.JWT, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Forbidden to modify the Token. Login again" });
    req.user = decoded; // will include id, email, role
    next();
  });
}

module.exports = { verifyToken };
