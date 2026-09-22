import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { protect } from '../middleware/auth.middleware.js';
import Setting from '../models/Setting.js';
import Profile from '../models/Profile.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resumeUploadDir = path.join(__dirname, '..', 'uploads', 'resumes');
const imageUploadDir = path.join(__dirname, '..', 'uploads', 'images');

if (!fs.existsSync(resumeUploadDir)) {
  fs.mkdirSync(resumeUploadDir, { recursive: true });
}
if (!fs.existsSync(imageUploadDir)) {
  fs.mkdirSync(imageUploadDir, { recursive: true });
}

// 1. Configure memory storage for uploaded images (ImgBB)
const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// 2. Configure disk storage for PDF Resumes / CVs
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.pdf';
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${cleanName}_${Date.now()}${ext}`);
  },
});

const uploadPdf = multer({
  storage: pdfStorage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
  fileFilter: (req, file, cb) => {
    const isPdf =
      file.mimetype === 'application/pdf' ||
      file.originalname.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF format documents (.pdf) are allowed!'), false);
    }
  },
});

/**
 * @route   POST /api/upload
 * @desc    Upload an image file or base64 to ImgBB API
 * @access  Protected
 */
router.post('/', protect, uploadImage.single('image'), async (req, res) => {
  try {
    let apiKey = req.headers['x-imgbb-key'] || process.env.IMGBB_API_KEY;

    if (!apiKey) {
      try {
        const keySetting = await Setting.findOne({ key: 'imgbb_api_key' });
        if (keySetting && keySetting.value) {
          apiKey = keySetting.value;
        }
      } catch {
        // Fallback check continues
      }
    }

    let base64Image;

    if (req.file) {
      base64Image = req.file.buffer.toString('base64');
    } else if (req.body.image) {
      base64Image = req.body.image.replace(/^data:image\/\w+;base64,/, '');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image file or base64 string to upload.',
      });
    }

    // 1. If ImgBB API key is configured, attempt upload to ImgBB CDN
    if (apiKey) {
      try {
        const formData = new FormData();
        formData.append('image', base64Image);

        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
            },
            timeout: 30000,
          }
        );

        if (response.data && response.data.success) {
          const data = response.data.data;
          return res.status(200).json({
            success: true,
            message: 'Image uploaded to ImgBB successfully',
            data: {
              id: data.id,
              title: data.title,
              url: data.url,
              display_url: data.display_url,
              thumb: data.thumb?.url || data.url,
              delete_url: data.delete_url,
              provider: 'imgbb',
            },
          });
        }
      } catch (imgbbErr) {
        console.warn('[ImgBB Notice] ImgBB upload failed, falling back to local server storage:', imgbbErr.response?.data || imgbbErr.message);
      }
    }

    // 2. Local Server Disk Fallback (if no ImgBB key or ImgBB temporary outage)
    const ext = req.file ? (path.extname(req.file.originalname).toLowerCase() || '.png') : '.png';
    const cleanName = req.file
      ? path.basename(req.file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_')
      : 'img';
    const filename = `${cleanName}_${Date.now()}${ext}`;
    const targetPath = path.join(imageUploadDir, filename);

    if (req.file) {
      fs.writeFileSync(targetPath, req.file.buffer);
    } else {
      fs.writeFileSync(targetPath, Buffer.from(base64Image, 'base64'));
    }

    const localUrl = `/uploads/images/${filename}`;
    return res.status(200).json({
      success: true,
      message: 'Image uploaded to local server storage (Tip: Configure ImgBB key in Settings to upload to ImgBB CDN)',
      data: {
        id: filename,
        url: localUrl,
        display_url: localUrl,
        provider: 'local',
      },
    });
  } catch (error) {
    console.error('Upload Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing image upload',
    });
  }
});

/**
 * @route   POST /api/upload/pdf
 * @desc    Upload Resume / CV in PDF format
 * @access  Protected
 */
router.post('/pdf', protect, uploadPdf.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid PDF file to upload.',
      });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/resumes/${req.file.filename}`;
    const relativeUrl = `/uploads/resumes/${req.file.filename}`;

    try {
      await Profile.findOneAndUpdate({}, { resumeUrl: fileUrl }, { upsert: true });
    } catch (dbErr) {
      console.warn('[PDF Upload] Auto-update profile warning:', dbErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Resume/CV PDF uploaded successfully!',
      data: {
        url: fileUrl,
        relativeUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error('[PDF Upload Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error uploading PDF file.',
    });
  }
});

export default router;
