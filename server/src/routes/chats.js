import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// ── Obtener o crear un chat ──────────────────────────────────
router.post('/', async (req, res) => {
    const { post_id, user_sender, user_receiver } = req.body;
    const conn = await pool.getConnection();
    try {
        const [[existing]] = await conn.execute(
            `SELECT chat_id FROM Chats 
             WHERE post_id = ? AND user_sender = ? AND user_receiver = ?`,
            [post_id, user_sender, user_receiver]
        );
        if (existing) return res.json({ chat_id: existing.chat_id });

        const [result] = await conn.execute(
            `INSERT INTO Chats (post_id, user_sender, user_receiver) VALUES (?, ?, ?)`,
            [post_id, user_sender, user_receiver]
        );
        res.status(201).json({ chat_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear chat', detail: err.message });
    } finally {
        conn.release();
    }
});

// ── Obtener todos los chats de un usuario ────────────────────
router.get('/:user_id', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT 
                c.chat_id, c.post_id, c.status, c.created_at,
                CASE 
                    WHEN c.user_sender = ? THEN c.user_receiver
                    ELSE c.user_sender
                END AS other_user_id,
                u.name AS other_user_name,
                (SELECT content FROM Messages m 
                 WHERE m.chat_id = c.chat_id 
                 ORDER BY m.sent_at DESC LIMIT 1) AS last_message,
                (SELECT sent_at FROM Messages m 
                 WHERE m.chat_id = c.chat_id 
                 ORDER BY m.sent_at DESC LIMIT 1) AS last_message_at
             FROM Chats c
             JOIN Users u ON u.user_id = CASE 
                 WHEN c.user_sender = ? THEN c.user_receiver
                 ELSE c.user_sender
             END
             WHERE c.user_sender = ? OR c.user_receiver = ?
             ORDER BY last_message_at DESC`,
            [req.params.user_id, req.params.user_id,
             req.params.user_id, req.params.user_id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener chats', detail: err.message });
    }
});

// ── Obtener mensajes de un chat ──────────────────────────────
router.get('/:chat_id/messages', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT 
                m.message_no, m.chat_id, m.user_id, m.type,
                m.content, m.sent_at, m.meet_lat, m.meet_lng,
                m.meet_date, m.meet_time,
                i.storage_url AS photo_url
             FROM Messages m
             LEFT JOIN Images i ON i.image_id = m.image_id
             WHERE m.chat_id = ?
             ORDER BY m.sent_at ASC`,
            [req.params.chat_id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener mensajes', detail: err.message });
    }
});

// ── Enviar un mensaje ────────────────────────────────────────
router.post('/:chat_id/messages', async (req, res) => {
    const { user_id, type, content, meet_lat, meet_lng, meet_date, meet_time } = req.body;
    const conn = await pool.getConnection();
    try {
        const [[{ next_no }]] = await conn.execute(
            `SELECT COALESCE(MAX(message_no), 0) + 1 AS next_no 
             FROM Messages WHERE chat_id = ?`,
            [req.params.chat_id]
        );

        await conn.execute(
            `INSERT INTO Messages 
                (message_no, chat_id, user_id, type, content, meet_lat, meet_lng, meet_date, meet_time)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [next_no, req.params.chat_id, user_id, type, content,
             meet_lat ?? null, meet_lng ?? null, meet_date ?? null, meet_time ?? null]
        );

        const mensaje = {
            message_no: next_no,
            chat_id: Number(req.params.chat_id),
            user_id,
            type,
            content,
            sent_at: new Date().toISOString(),
            meet_lat: meet_lat ?? null,
            meet_lng: meet_lng ?? null,
            meet_date: meet_date ?? null,
            meet_time: meet_time ?? null
        };

        // Emitir a todos en la sala
        console.log('Emitiendo a sala:', `chat_${req.params.chat_id}`);
        const io = getIO();
        io.to(`chat_${req.params.chat_id}`).emit('nuevo_mensaje', mensaje);

        res.status(201).json({ message_no: next_no });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al enviar mensaje', detail: err.message });
    } finally {
        conn.release();
    }
});

// ── Cerrar un chat ───────────────────────────────────────────
router.patch('/:chat_id/close', async (req, res) => {
    try {
        await pool.execute(
            `UPDATE Chats SET status = 'Closed' WHERE chat_id = ?`,
            [req.params.chat_id]
        );
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al cerrar chat', detail: err.message });
    }
});

export default router;