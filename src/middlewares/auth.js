const { verifyAccessToken } = require('../utils/token');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;  
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Authentication required' });
  
  const token = authHeader.split(' ')[1];
  
  try {
    const accessToken = verifyAccessToken(token);
    req.user = accessToken;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware; 