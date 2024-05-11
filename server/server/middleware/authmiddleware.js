const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, 'Fayad', (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
      } else {
        
        req.user = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

module.exports = authenticateJWT;
