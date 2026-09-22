import express from 'express';
import Project from '../models/Project.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

let cachedProjects = [
  {
    _id: '1',
    title: 'BuildSync Hub',
    category: 'fullstack',
    type: 'Building Management System',
    description:
      'A comprehensive Building & Apartment Management web application featuring role-based dashboards (Admin, Member, User), apartment agreements, secure payments via Stripe, and announcement noticeboards.',
    technologies: [
      'React.js',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Tailwind CSS',
      'Firebase Auth',
      'Stripe Payments',
    ],
    liveUrl: 'https://comfy-eclair-fabcdd.netlify.app/',
    githubUrl: 'https://github.com/Shahreyar-Tonmoy/Building--Menagement-Client',
    images: [],
    featured: true,
    order: 1,
  },
  {
    _id: '2',
    title: 'Group Study Hub',
    category: 'fullstack',
    type: 'Collaborative Learning Platform',
    description:
      'An interactive online group study platform empowering students to create, submit, and grade shared assignments with peers, featuring real-time status tracking, filtering, and responsive mobile-first UI.',
    technologies: [
      'React.js',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Tailwind CSS',
      'Firebase',
      'JWT Auth',
    ],
    liveUrl: 'https://bucolic-blini-9bf008.netlify.app/',
    githubUrl: 'https://github.com/Shahreyar-Tonmoy/Group-Study-Client',
    images: [],
    featured: true,
    order: 2,
  },
  {
    _id: '3',
    title: 'Fashion Store',
    category: 'frontend',
    type: 'E-Commerce Brand Shop',
    description:
      'A sleek modern apparel brand shop and e-commerce showcase application with dynamic product filtering, cart management, dark/light aesthetics, and intuitive product customization workflows.',
    technologies: [
      'React.js',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Tailwind CSS',
      'Firebase',
      'DaisyUI',
    ],
    liveUrl: 'https://bucolic-genie-cb2e42.netlify.app/',
    githubUrl: 'https://github.com/Shahreyar-Tonmoy/Brand-Shop-Client',
    images: [],
    featured: true,
    order: 3,
  },
];

/**
 * @route   GET /api/projects
 * @desc    Fetch all projects
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    if (projects && projects.length > 0) {
      cachedProjects = projects;
      return res.json({ success: true, data: projects });
    }
    return res.json({ success: true, data: cachedProjects });
  } catch (error) {
    return res.json({ success: true, data: cachedProjects });
  }
});

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Protected
 */
router.post('/', protect, async (req, res) => {
  try {
    const { title, category, type, description, technologies, liveUrl, githubUrl, images, featured, order } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const techArray = Array.isArray(technologies)
      ? technologies
      : typeof technologies === 'string'
      ? technologies.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const projectData = {
      title,
      category: category || 'fullstack',
      type: type || 'Web Application',
      description,
      technologies: techArray,
      liveUrl: liveUrl || '',
      githubUrl: githubUrl || '',
      images: Array.isArray(images)
        ? images
        : typeof images === 'string' && images
        ? [images]
        : [],
      featured: featured !== undefined ? featured : true,
      order: order ? Number(order) : cachedProjects.length + 1,
    };

    try {
      const newProject = await Project.create(projectData);
      cachedProjects.push(newProject);
      return res.status(201).json({ success: true, message: 'Project created successfully', data: newProject });
    } catch {
      const mockProject = { _id: Date.now().toString(), ...projectData };
      cachedProjects.push(mockProject);
      return res.status(201).json({ success: true, message: 'Project created in memory', data: mockProject });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   PUT /api/projects/:id
 * @desc    Update an existing project
 * @access  Protected
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const techArray = req.body.technologies
      ? Array.isArray(req.body.technologies)
        ? req.body.technologies
        : req.body.technologies.split(',').map((t) => t.trim()).filter(Boolean)
      : undefined;

    const updateData = { ...req.body };
    if (techArray) updateData.technologies = techArray;
    if (req.body.images !== undefined) {
      updateData.images = Array.isArray(req.body.images)
        ? req.body.images
        : typeof req.body.images === 'string' && req.body.images
        ? [req.body.images]
        : [];
    }

    try {
      const updated = await Project.findByIdAndUpdate(id, updateData, { new: true });
      if (updated) {
        cachedProjects = cachedProjects.map((p) => (p._id.toString() === id ? updated : p));
        return res.json({ success: true, message: 'Project updated successfully', data: updated });
      }
    } catch {
      // Continue to fallback
    }

    // Cache fallback update
    cachedProjects = cachedProjects.map((p) =>
      p._id.toString() === id ? { ...p, ...updateData } : p
    );
    const found = cachedProjects.find((p) => p._id.toString() === id);
    return res.json({ success: true, message: 'Project updated', data: found });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project
 * @access  Protected
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Project.findByIdAndDelete(id);
    } catch {
      // Fallback ignore
    }

    cachedProjects = cachedProjects.filter((p) => p._id.toString() !== id);
    return res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
