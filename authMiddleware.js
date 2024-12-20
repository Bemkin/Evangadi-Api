const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized', message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'
      });
    }

    req.user = decoded; // Attach decoded token payload to request object
    console.log('Decoded token:', decoded); // Debugging: Log decoded token
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authMiddleware;
