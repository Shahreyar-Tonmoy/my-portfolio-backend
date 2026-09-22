import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'tonmoy_cyber_portfolio_secret_key_2026_jwt'
      );

      // Attach user info (fallback if mongo in mock mode)
      try {
        const user = await User.findById(decoded.id).select('-password');
        req.user = user || { id: decoded.id, username: decoded.username, role: 'admin' };
      } catch {
        req.user = { id: decoded.id, username: decoded.username, role: 'admin' };
      }

      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};
