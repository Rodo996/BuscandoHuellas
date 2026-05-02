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
// Agregar después de la ruta existente de /upload/:post_id

router.post('/upload/chat/:chat_id', upload.single('image'), async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { chat_id } = req.params;
        const { user_id } = req.body;
        const storage_url = req.file.location;

        // Guardar imagen en tabla Images
        const [imgResult] = await conn.execute(
            `INSERT INTO Images (post_id, storage_url, type) VALUES (NULL, ?, 'post')`,
            [storage_url]
        );
        const image_id = imgResult.insertId;

        // Calcular siguiente message_no
        const [[{ next_no }]] = await conn.execute(
            `SELECT COALESCE(MAX(message_no), 0) + 1 AS next_no 
             FROM Messages WHERE chat_id = ?`,
            [chat_id]
        );

        // Crear mensaje con la imagen
        await conn.execute(
            `INSERT INTO Messages (message_no, chat_id, user_id, image_id, type, content)
             VALUES (?, ?, ?, ?, 'Proof of Ownership', 'Evidencia fotográfica')`,
            [next_no, chat_id, user_id, image_id]
        );

        res.json({ success: true, url: storage_url, image_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error subiendo imagen de chat' });
    } finally {
        conn.release();
    }
});
export default router;