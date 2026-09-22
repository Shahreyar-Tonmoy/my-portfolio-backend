import express from 'express';
import Education from '../models/Education.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

let cachedEducation = [
  {
    _id: '1',
    period: '2023 - Present',
    level: 'Higher Secondary Certificate (HSC)',
    institution: 'Karatoa Multimedia School & College',
    location: 'Bogura, Bangladesh',
    department: 'Science Division',
    status: 'Currently Enrolled',
    grade: 'Pursuing',
    description:
      'Deepening analytical problem solving, higher mathematics, physics, and computing concepts while actively practicing front-end software engineering.',
    highlight: 'Ongoing Academic Excellence',
    order: 1,
  },
  {
    _id: '2',
    period: '2018 - 2023',
    level: 'Secondary School Certificate (SSC)',
    institution: 'Ramdeo Bazla Govt. High School',
    location: 'Joypurhat, Bangladesh',
    department: 'Science Division',
    status: 'Completed',
    grade: 'GPA 5.00 / 5.00 (Golden)',
    description:
      'Graduated with top academic standing across all sciences, fostering mathematical precision and early passion for algorithms and web technologies.',
    highlight: 'Perfect GPA 5.00',
    order: 2,
  },
];

/**
 * @route   GET /api/education
 * @desc    Get all education records
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const records = await Education.find().sort({ order: 1 });
    if (records && records.length > 0) {
      cachedEducation = records;
      return res.json({ success: true, data: records });
    }
    return res.json({ success: true, data: cachedEducation });
  } catch (error) {
    return res.json({ success: true, data: cachedEducation });
  }
});

/**
 * @route   POST /api/education
 * @desc    Add education milestone
 * @access  Protected
 */
router.post('/', protect, async (req, res) => {
  try {
    const { period, level, institution, location, department, grade, description, highlight, order } = req.body;
    if (!period || !level || !institution) {
      return res.status(400).json({ success: false, message: 'Period, Level, and Institution are required' });
    }

    const itemData = {
      period,
      level,
      institution,
      location: location || '',
      department: department || 'Science Division',
      grade: grade || 'GPA 5.00',
      description: description || '',
      highlight: highlight || '',
      order: order ? Number(order) : cachedEducation.length + 1,
    };

    try {
      const created = await Education.create(itemData);
      cachedEducation.push(created);
      return res.status(201).json({ success: true, message: 'Milestone added successfully', data: created });
    } catch {
      const mock = { _id: Date.now().toString(), ...itemData };
      cachedEducation.push(mock);
      return res.status(201).json({ success: true, message: 'Milestone added', data: mock });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   PUT /api/education/:id
 * @desc    Update education milestone
 * @access  Protected
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const updated = await Education.findByIdAndUpdate(id, req.body, { new: true });
      if (updated) {
        cachedEducation = cachedEducation.map((e) => (e._id.toString() === id ? updated : e));
        return res.json({ success: true, message: 'Milestone updated', data: updated });
      }
    } catch {
      // Fallback
    }

    cachedEducation = cachedEducation.map((e) => (e._id.toString() === id ? { ...e, ...req.body } : e));
    const found = cachedEducation.find((e) => e._id.toString() === id);
    return res.json({ success: true, message: 'Milestone updated', data: found });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   DELETE /api/education/:id
 * @desc    Delete milestone
 * @access  Protected
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Education.findByIdAndDelete(id);
    } catch {
      // Fallback
    }
    cachedEducation = cachedEducation.filter((e) => e._id.toString() !== id);
    return res.json({ success: true, message: 'Milestone deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
