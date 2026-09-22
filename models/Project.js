import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'fullstack',
      enum: ['fullstack', 'frontend', 'mern', 'mobile', 'other'],
    },
    type: {
      type: String,
      default: 'Web Application',
    },
    description: {
      type: String,
      required: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    liveUrl: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
