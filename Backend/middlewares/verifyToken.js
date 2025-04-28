import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

const verifyToken = (req, res, next) => {
  // const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
  const token = req.cookies.token; // Extract token from Authorization header
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded token (user info) to the request object
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default verifyToken;
