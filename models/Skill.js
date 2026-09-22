import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'frontend',
      enum: ['frontend', 'backend', 'tools', 'other'],
    },
    level: {
      type: String,
      default: 'Advanced',
    },
    pct: {
      type: String,
      default: '85%',
    },
    icon: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'from-emerald-500 to-cyan-500',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
