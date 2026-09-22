import express from 'express';
import Profile from '../models/Profile.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// In-memory fallback if Mongo is offline during dev
let cachedProfile = null;

const defaultProfile = {
  name: 'Shahreyar Tonmoy',
  title: 'Front-End & Full-Stack Developer',
  tagline: 'Crafting High-Performance Web & Digital Experiences',
  typewriterRoles: [
    'Front-End Developer',
    'React.js Specialist',
    'Full-Stack Developer',
    'MERN Stack Engineer',
  ],
  bio: "Hi! I'm Shahreyar Tonmoy. I transform ideas into high-performance, attractive web applications with cutting-edge front-end engineering, interactive WebGL graphics, and responsive UI design.",
  email: 'Shahreyartonmoy001@gmail.com',
  location: 'Joypurhat, Bangladesh',
  resumeUrl: '',
  profileImage: '',
  experienceYears: '01+',
  projectsCount: '12+',
  dedicationPct: '100%',
  socialLinks: {
    github: 'https://github.com/Shahreyar-Tonmoy',
    linkedin: 'https://www.linkedin.com/in/shahreyar-tonmoy',
    facebook: 'https://www.facebook.com/profile.php?id=100019141502263',
    instagram: 'https://www.instagram.com/shahreyar.tonmoy/',
    twitter: 'https://twitter.com/ShahreyarT38896',
  },
  focusAreas: [
    'React.js',
    'Node.js',
    'Express.js',
    'MongoDB',
    'JavaScript (ES6+)',
    'Tailwind CSS',
    'REST APIs',
    'Firebase',
  ],
  aboutBadge: 'About Me',
  aboutHeading: 'Engineering with Purpose & Precision',
  aboutSubheading:
    'Bridging front-end artistry with robust full-stack architecture to build seamless digital applications.',
  aboutRoleBadge: 'Front-End & Full-Stack',
  aboutStory: '',
  philosophyPillars: [
    {
      title: 'Component Architecture',
      description:
        'Composable, reusable React components with optimized render cycles and clean state flow.',
      icon: 'layers',
    },
    {
      title: 'Scalable REST APIs',
      description:
        'Structured Node.js & Express routing, JWT security, and MongoDB schema design.',
      icon: 'server',
    },
    {
      title: 'Performance & A11y',
      description:
        'Fluid responsive designs, high Core Web Vitals, and accessible semantic markup.',
      icon: 'zap',
    },
  ],
};

/**
 * @route   GET /api/profile
 * @desc    Get portfolio profile data
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      if (cachedProfile) {
        return res.json({ success: true, data: cachedProfile });
      }
      // Create initial profile in MongoDB
      try {
        profile = await Profile.create(defaultProfile);
      } catch {
        cachedProfile = defaultProfile;
        return res.json({ success: true, data: defaultProfile });
      }
    }
    cachedProfile = profile;
    return res.json({ success: true, data: profile });
  } catch (error) {
    return res.json({ success: true, data: cachedProfile || defaultProfile });
  }
});

/**
 * @route   PUT /api/profile
 * @desc    Update portfolio profile data
 * @access  Protected
 */
router.put('/', protect, async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (profile) {
      Object.assign(profile, req.body);
      await profile.save();
      cachedProfile = profile;
      return res.json({ success: true, message: 'Profile updated successfully', data: profile });
    } else {
      try {
        profile = await Profile.create(req.body);
        cachedProfile = profile;
        return res.json({ success: true, message: 'Profile created successfully', data: profile });
      } catch {
        cachedProfile = { ...defaultProfile, ...req.body };
        return res.json({ success: true, message: 'Profile cached in memory', data: cachedProfile });
      }
    }
  } catch (error) {
    cachedProfile = { ...defaultProfile, ...req.body };
    return res.json({ success: true, message: 'Profile updated in cache', data: cachedProfile });
  }
});

export default router;
