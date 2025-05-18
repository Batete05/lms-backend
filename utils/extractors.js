const jwt = require("jsonwebtoken");
require("dotenv").config();

const randomatic = require("randomatic");
function extractUserIdFromToken(req) {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(" ")[1] : null;
  const decodedToken = jwt.decode(token);
  const userId = decodedToken ? decodedToken._id : null;
  return userId;
}
function extractRoledFromToken(req) {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(" ")[1] : null;
  const decodedToken = jwt.decode(token);
  const role = decodedToken ? decodedToken.role : null;
  return role;
}
function extractIsVerifiedFromToken(req) {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(" ")[1] : null;
  const decodedToken = jwt.decode(token);
  const value = decodedToken ? decodedToken.isVerified : null;
  return value;
}
function extractEmailAndNameFromToken(req) {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(" ")[1] : null;
  const decodedToken = jwt.decode(token);
  const name = decodedToken ? decodedToken.name : null;
  const email = decodedToken ? decodedToken.email : null;
  return { email, name };
}
function getRandomStringFromArray(strings) {
  if (strings.length === 0) {
    return null; // handle empty array case
  }
  const randomIndex = randomatic("0", 1); // Generate a single random digit (0-9)
  const index = parseInt(randomIndex) % strings.length; // Map to valid index
  return strings[index];
}
module.exports = {
  extractUserIdFromToken,
  extractRoledFromToken,
  extractEmailAndNameFromToken,
  extractIsVerifiedFromToken,
  getRandomStringFromArray,
};
