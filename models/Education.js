import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    period: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    institution: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      default: 'Science Division',
    },
    status: {
      type: String,
      default: 'Completed',
    },
    grade: {
      type: String,
      default: 'GPA 5.00',
    },
    description: {
      type: String,
      default: '',
    },
    highlight: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Education = mongoose.model('Education', educationSchema);
export default Education;
