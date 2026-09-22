import express from 'express';
import Setting from '../models/Setting.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

let cachedSettings = {
  imgbb_api_key: process.env.IMGBB_API_KEY || '',
};

/**
 * @route   GET /api/settings
 * @desc    Get system settings
 * @access  Protected
 */
router.get('/', protect, async (req, res) => {
  try {
    const settings = await Setting.find();
    const result = { ...cachedSettings };
    if (settings && settings.length > 0) {
      settings.forEach((s) => {
        result[s.key] = s.value;
      });
    }
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.json({ success: true, data: cachedSettings });
  }
});

/**
 * @route   PUT /api/settings
 * @desc    Update setting
 * @access  Protected
 */
router.put('/', protect, async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) {
      return res.status(400).json({ success: false, message: 'Setting key is required' });
    }

    try {
      await Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
    } catch {
      // Fallback
    }

    cachedSettings[key] = value;
    if (key === 'imgbb_api_key') {
      process.env.IMGBB_API_KEY = value;
    }

    return res.json({ success: true, message: `Setting ${key} updated`, data: cachedSettings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
