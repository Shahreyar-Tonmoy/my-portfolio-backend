import express from 'express';
import Skill from '../models/Skill.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

let cachedSkills = [
  { _id: '1', name: 'React.js', category: 'frontend', level: 'Advanced', pct: '90%', icon: '', desc: 'Component architecture, hooks, state management, and virtual DOM optimization.', color: 'from-cyan-500 to-blue-500', order: 1 },
  { _id: '2', name: 'JavaScript (ES6+)', category: 'frontend', level: 'Advanced', pct: '88%', icon: '', desc: 'Modern asynchronous workflows, closures, DOM manipulation, promises, and modular patterns.', color: 'from-yellow-400 to-amber-500', order: 2 },
  { _id: '3', name: 'Node.js', category: 'backend', level: 'Intermediate', pct: '75%', icon: '', desc: 'Server-side runtime, event loop, asynchronous IO, and backend script execution.', color: 'from-green-500 to-emerald-600', order: 3 },
  { _id: '4', name: 'Express.js', category: 'backend', level: 'Intermediate', pct: '78%', icon: '', desc: 'RESTful API creation, custom middleware, routing architecture, and JSON handling.', color: 'from-slate-300 to-slate-500', order: 4 },
  { _id: '5', name: 'MongoDB & Mongoose', category: 'backend', level: 'Intermediate', pct: '76%', icon: '', desc: 'NoSQL document database design, CRUD operations, indexing, and schemas.', color: 'from-emerald-500 to-green-600', order: 5 },
  { _id: '6', name: 'Tailwind CSS', category: 'frontend', level: 'Advanced', pct: '95%', icon: '', desc: 'Utility-first responsive layouts, customized design systems, and glassmorphism styling.', color: 'from-sky-400 to-cyan-500', order: 6 },
  { _id: '7', name: 'Firebase', category: 'backend', level: 'Proficient', pct: '82%', icon: '', desc: 'Authentication, Firestore real-time database, web hosting, and security rule setup.', color: 'from-amber-400 to-orange-500', order: 7 },
  { _id: '8', name: 'Git & GitHub', category: 'tools', level: 'Advanced', pct: '88%', icon: '', desc: 'Version control, branching workflows, pull requests, and repository management.', color: 'from-rose-500 to-orange-500', order: 8 },
];

/**
 * @route   GET /api/skills
 * @desc    Get all skills
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1 });
    if (skills && skills.length > 0) {
      cachedSkills = skills;
      return res.json({ success: true, data: skills });
    }
    return res.json({ success: true, data: cachedSkills });
  } catch (error) {
    return res.json({ success: true, data: cachedSkills });
  }
});

/**
 * @route   POST /api/skills
 * @desc    Create a skill
 * @access  Protected
 */
router.post('/', protect, async (req, res) => {
  try {
    const { name, category, level, pct, icon, desc, color, order } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Skill name is required' });
    }

    const skillData = {
      name,
      category: category || 'frontend',
      level: level || 'Advanced',
      pct: pct ? (pct.includes('%') ? pct : `${pct}%`) : '80%',
      icon: icon || '',
      desc: desc || '',
      color: color || 'from-emerald-500 to-cyan-500',
      order: order ? Number(order) : cachedSkills.length + 1,
    };

    try {
      const newSkill = await Skill.create(skillData);
      cachedSkills.push(newSkill);
      return res.status(201).json({ success: true, message: 'Skill added successfully', data: newSkill });
    } catch {
      const mock = { _id: Date.now().toString(), ...skillData };
      cachedSkills.push(mock);
      return res.status(201).json({ success: true, message: 'Skill added', data: mock });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   PUT /api/skills/:id
 * @desc    Update a skill
 * @access  Protected
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const updated = await Skill.findByIdAndUpdate(id, req.body, { new: true });
      if (updated) {
        cachedSkills = cachedSkills.map((s) => (s._id.toString() === id ? updated : s));
        return res.json({ success: true, message: 'Skill updated successfully', data: updated });
      }
    } catch {
      // Fallback
    }

    cachedSkills = cachedSkills.map((s) => (s._id.toString() === id ? { ...s, ...req.body } : s));
    const found = cachedSkills.find((s) => s._id.toString() === id);
    return res.json({ success: true, message: 'Skill updated', data: found });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   DELETE /api/skills/:id
 * @desc    Delete a skill
 * @access  Protected
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Skill.findByIdAndDelete(id);
    } catch {
      // Fallback
    }
    cachedSkills = cachedSkills.filter((s) => s._id.toString() !== id);
    return res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
