import express from 'express';
import { auth } from '../middleware/auth.js';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import Document from '../models/Document.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload document
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { documentType, title, semester, academicYear } = req.body;

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'university_documents',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Save document record
    const document = new Document({
      userId: req.userId,
      documentType,
      title: title || req.file.originalname,
      fileUrl: result.secure_url,
      cloudinaryId: result.public_id,
      semester,
      academicYear
    });

    await document.save();

    res.json({
      message: 'Document uploaded successfully',
      document
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get my documents
router.get('/my-documents', auth, async (req, res) => {
  try {
    const { documentType, semester } = req.query;
    
    const filter = { userId: req.userId };
    if (documentType) filter.documentType = documentType;
    if (semester) filter.semester = parseInt(semester);

    const documents = await Document.find(filter)
      .sort({ uploadedAt: -1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete document
router.delete('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (document.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete from Cloudinary
    if (document.cloudinaryId) {
      await cloudinary.uploader.destroy(document.cloudinaryId);
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;