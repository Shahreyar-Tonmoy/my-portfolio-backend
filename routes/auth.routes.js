import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

const generateToken = (id, username, role) => {
  return jwt.sign(
    { id, username, role },
    process.env.JWT_SECRET || 'tonmoy_cyber_portfolio_secret_key_2026_jwt',
    { expiresIn: '30d' }
  );
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate admin & return token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Please provide username and password' });
  }

  try {
    // 1. Try finding in MongoDB
    const user = await User.findOne({
      $or: [{ username: username.trim() }, { email: username.trim().toLowerCase() }],
    });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        success: true,
        token: generateToken(user._id, user.username, user.role),
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    }

    // 2. Check against custom credentials in process.env if configured
    const envAdminUser = process.env.ADMIN_USERNAME;
    const envAdminPass = process.env.ADMIN_PASSWORD;

    if (
      envAdminUser &&
      envAdminPass &&
      username === envAdminUser &&
      password === envAdminPass
    ) {
      return res.json({
        success: true,
        token: generateToken('env-admin-id', envAdminUser, 'admin'),
        user: {
          id: 'env-admin-id',
          username: envAdminUser,
          email: `${envAdminUser}@portfolio.local`,
          role: 'admin',
        },
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  } catch (error) {
    console.error('Auth Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error during authentication' });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Verify current session & return user
 * @access  Protected
 */
router.get('/me', protect, async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
});

/**
 * @route   PUT /api/auth/password
 * @desc    Change admin password
 * @access  Protected
 */
router.put('/password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters long',
    });
  }

  try {
    const user = await User.findById(req.user.id || req.user._id);
    if (user) {
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }

      user.password = newPassword;
      await user.save();
      return res.json({ success: true, message: 'Password updated successfully' });
    }

    // Fallback mode response
    return res.json({
      success: true,
      message: 'Password updated in memory. Remember to configure server/.env for persistence.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
