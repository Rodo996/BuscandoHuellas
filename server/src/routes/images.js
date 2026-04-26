import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import pool from '../db.js';

const router = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const filename = `posts/${Date.now()}-${file.originalname}`;
      cb(null, filename);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Solo se permiten imágenes'));
  },
});

router.post('/upload/:post_id', upload.single('image'), async (req, res) => {
  try {
    const { post_id } = req.params;
    const storage_url = req.file.location;

    await pool.query(
      'INSERT INTO Images (post_id, storage_url, type) VALUES (?, ?, ?)',
      [post_id, storage_url, 'post']
    );

    res.json({ success: true, url: storage_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error subiendo imagen' });
  }
});

export default router;