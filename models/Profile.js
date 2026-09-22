import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Shahreyar Tonmoy',
    },
    title: {
      type: String,
      default: 'Front-End & Full-Stack Developer',
    },
    tagline: {
      type: String,
      default: 'Crafting High-Performance Web & Digital Experiences',
    },
    typewriterRoles: {
      type: [String],
      default: [
        'Front-End Developer',
        'React.js Specialist',
        'Full-Stack Developer',
        'MERN Stack Engineer',
      ],
    },
    bio: {
      type: String,
      default:
        "Hi! I'm Shahreyar Tonmoy. I transform ideas into high-performance, attractive web applications with cutting-edge front-end engineering, interactive WebGL graphics, and responsive UI design.",
    },
    email: {
      type: String,
      default: 'Shahreyartonmoy001@gmail.com',
    },
    location: {
      type: String,
      default: 'Joypurhat, Bangladesh',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    experienceYears: {
      type: String,
      default: '01+',
    },
    projectsCount: {
      type: String,
      default: '12+',
    },
    dedicationPct: {
      type: String,
      default: '100%',
    },
    socialLinks: {
      github: { type: String, default: 'https://github.com/Shahreyar-Tonmoy' },
      linkedin: { type: String, default: 'https://www.linkedin.com/in/shahreyar-tonmoy' },
      facebook: { type: String, default: 'https://www.facebook.com/profile.php?id=100019141502263' },
      instagram: { type: String, default: 'https://www.instagram.com/shahreyar.tonmoy/' },
      twitter: { type: String, default: 'https://twitter.com/ShahreyarT38896' },
    },
    focusAreas: {
      type: [String],
      default: [
        'React.js',
        'Node.js',
        'Express.js',
        'MongoDB',
        'JavaScript (ES6+)',
        'Tailwind CSS',
        'REST APIs',
        'Firebase',
      ],
    },
    aboutBadge: {
      type: String,
      default: 'About Me',
    },
    aboutHeading: {
      type: String,
      default: 'Engineering with Purpose & Precision',
    },
    aboutSubheading: {
      type: String,
      default:
        'Bridging front-end artistry with robust full-stack architecture to build seamless digital applications.',
    },
    aboutRoleBadge: {
      type: String,
      default: 'Front-End & Full-Stack',
    },
    aboutStory: {
      type: String,
      default: '',
    },
    philosophyPillars: {
      type: [
        {
          title: String,
          description: String,
          icon: String,
        },
      ],
      default: [
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
    },
  },
  { timestamps: true, strict: false }
);

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
