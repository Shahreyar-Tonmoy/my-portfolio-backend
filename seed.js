import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Profile from './models/Profile.js';
import Project from './models/Project.js';
import Skill from './models/Skill.js';
import Education from './models/Education.js';
import Setting from './models/Setting.js';

dotenv.config();

const initialAdmin = {
  username: process.env.ADMIN_USERNAME || 'shahreyartonmoy001@gmail.com',
  email: 'shahreyartonmoy001@gmail.com',
  password: process.env.ADMIN_PASSWORD || 'Shahreyar#001',
  role: 'admin',
};

const initialProfile = {
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
};

const initialProjects = [
  {
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
    featured: true,
    order: 1,
  },
  {
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
    featured: true,
    order: 2,
  },
  {
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
    featured: true,
    order: 3,
  },
];

const initialSkills = [
  { name: 'React.js', category: 'frontend', level: 'Advanced', pct: '90%', desc: 'Component architecture, hooks, state management, and virtual DOM optimization.', color: 'from-cyan-500 to-blue-500', order: 1 },
  { name: 'JavaScript (ES6+)', category: 'frontend', level: 'Advanced', pct: '88%', desc: 'Modern asynchronous workflows, closures, DOM manipulation, promises, and modular patterns.', color: 'from-yellow-400 to-amber-500', order: 2 },
  { name: 'Node.js', category: 'backend', level: 'Intermediate', pct: '75%', desc: 'Server-side runtime, event loop, asynchronous IO, and backend script execution.', color: 'from-green-500 to-emerald-600', order: 3 },
  { name: 'Express.js', category: 'backend', level: 'Intermediate', pct: '78%', desc: 'RESTful API creation, custom middleware, routing architecture, and JSON handling.', color: 'from-slate-300 to-slate-500', order: 4 },
  { name: 'MongoDB & Mongoose', category: 'backend', level: 'Intermediate', pct: '76%', desc: 'NoSQL document database design, CRUD operations, indexing, and schemas.', color: 'from-emerald-500 to-green-600', order: 5 },
  { name: 'Tailwind CSS', category: 'frontend', level: 'Advanced', pct: '95%', desc: 'Utility-first responsive layouts, customized design systems, and glassmorphism styling.', color: 'from-sky-400 to-cyan-500', order: 6 },
  { name: 'Firebase', category: 'backend', level: 'Proficient', pct: '82%', desc: 'Authentication, Firestore real-time database, web hosting, and security rule setup.', color: 'from-amber-400 to-orange-500', order: 7 },
  { name: 'Git & GitHub', category: 'tools', level: 'Advanced', pct: '88%', desc: 'Version control, branching workflows, pull requests, and repository management.', color: 'from-rose-500 to-orange-500', order: 8 },
];

const initialEducation = [
  {
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

export const seedDatabase = async () => {
  try {
    // 1. Seed Admin User
    const adminExists = await User.findOne({ username: initialAdmin.username });
    if (!adminExists) {
      await User.create(initialAdmin);
      console.log(`[Seed] Admin user created: ${initialAdmin.username}`);
    }

    // 2. Seed Profile
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      await Profile.create(initialProfile);
      console.log('[Seed] Default profile seeded.');
    }

    // 3. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany(initialProjects);
      console.log(`[Seed] ${initialProjects.length} initial projects seeded.`);
    }

    // 4. Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany(initialSkills);
      console.log(`[Seed] ${initialSkills.length} initial skills seeded.`);
    }

    // 5. Seed Education
    const educationCount = await Education.countDocuments();
    if (educationCount === 0) {
      await Education.insertMany(initialEducation);
      console.log(`[Seed] ${initialEducation.length} education milestones seeded.`);
    }

    // 6. Seed Setting for ImgBB
    const imgbbSetting = await Setting.findOne({ key: 'imgbb_api_key' });
    if (!imgbbSetting) {
      await Setting.create({ key: 'imgbb_api_key', value: process.env.IMGBB_API_KEY || '' });
    }

    return true;
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    return false;
  }
};

// If run directly via node seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/my_portfolio';
  mongoose
    .connect(uri)
    .then(async () => {
      console.log('[Seed] Connected to MongoDB for seeding.');
      await seedDatabase();
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed] Database connection error:', err.message);
      process.exit(1);
    });
}
