import express from 'express';
import pdfParse from 'pdf-parse';
import { generateQuestionsFromResume } from '../controllers/resumeController.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const multer = require('multer');

const router = express.Router();
const upload = multer();

router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;
    const data = await pdfParse(pdfBuffer);
    const questions = await generateQuestionsFromResume(data.text);
    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Resume upload failed' });
  }
});

export default router;
