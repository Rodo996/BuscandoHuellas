import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/:user_id', async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT notif_no, type, content, date, is_read
     FROM Notifications
     WHERE user_id = ? ORDER BY date DESC LIMIT 20`,
    [req.params.user_id]
  );
  res.json(rows);
});

router.patch('/:notif_no/read', async (req, res) => {
  await pool.execute(
    `UPDATE Notifications SET is_read = TRUE, read_at = NOW() WHERE notif_no = ?`,
    [req.params.notif_no]
  );
  res.json({ ok: true });
});

export default router;