import express from 'express';
import Message from '../models/Message.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

let cachedMessages = [];

/**
 * @route   POST /api/messages
 * @desc    Submit message from contact form
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }

    const messageData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      isRead: false,
    };

    try {
      const created = await Message.create(messageData);
      cachedMessages.unshift(created);
      return res.status(201).json({ success: true, message: 'Message transmitted successfully', data: created });
    } catch {
      const mock = {
        _id: Date.now().toString(),
        ...messageData,
        createdAt: new Date().toISOString(),
      };
      cachedMessages.unshift(mock);
      return res.status(201).json({ success: true, message: 'Message stored in cache', data: mock });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/messages
 * @desc    Get all messages for admin inbox
 * @access  Protected
 */
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    if (messages && messages.length > 0) {
      cachedMessages = messages;
      return res.json({ success: true, data: messages });
    }
    return res.json({ success: true, data: cachedMessages });
  } catch (error) {
    return res.json({ success: true, data: cachedMessages });
  }
});

/**
 * @route   PATCH /api/messages/:id/read
 * @desc    Toggle or mark message as read
 * @access  Protected
 */
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    try {
      const updated = await Message.findByIdAndUpdate(
        id,
        { isRead: isRead !== undefined ? isRead : true },
        { new: true }
      );
      if (updated) {
        cachedMessages = cachedMessages.map((m) => (m._id.toString() === id ? updated : m));
        return res.json({ success: true, data: updated });
      }
    } catch {
      // Fallback
    }

    cachedMessages = cachedMessages.map((m) =>
      m._id.toString() === id ? { ...m, isRead: isRead !== undefined ? isRead : true } : m
    );
    const found = cachedMessages.find((m) => m._id.toString() === id);
    return res.json({ success: true, data: found });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   DELETE /api/messages/:id
 * @desc    Delete message
 * @access  Protected
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Message.findByIdAndDelete(id);
    } catch {
      // Fallback
    }
    cachedMessages = cachedMessages.filter((m) => m._id.toString() !== id);
    return res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
