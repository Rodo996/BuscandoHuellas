import { Router } from "express";
import pool from "../db.js";

const router = Router();

// ==========================================
// POST: CREAR UN CASO DE ÉXITO (CERRAR CASO)
// ==========================================
router.post("/", async (req, res) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const { pet_id, story } = req.body;

        if (!pet_id) return res.status(400).json({ error: "Falta el ID de la mascota." });

        // 1. Insertamos el post (quitamos closed_at para que MySQL asigne NULL por defecto)
        const [postResult] = await conn.execute(
            `INSERT INTO Posts (user_id, pet_id, location_id, type, date, story, status, created_at) 
             VALUES (1, ?, 1, 'Success Story', NOW(), ?, 'Active', NOW());`,
            [pet_id, story]
        );

        const newPostId = postResult.insertId;

        // 2. Usamos 'Closed' en vez de 'Encontrado' para evitar errores de ENUM
        await conn.execute(
            `UPDATE Posts SET status = 'Closed' WHERE pet_id = ? AND type != 'Success Story';`,
            [pet_id]
        );

        await conn.commit();
        res.status(201).json({ post_id: newPostId });
    } catch (err) {
        await conn.rollback();
        console.error("Error MySQL:", err.message); 
        // ¡Magia! Enviamos el error real al frontend:
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

// ==========================================
// GET: LEER TODOS LOS CASOS DE ÉXITO
// ==========================================
router.get("/", async (req, res) => {
    try {
        const sql = `
            SELECT
                p.post_id,
                pt.name AS name,
                p.date AS fecha_recuperacion,
                p.story,
                (
                    -- Imagen original (cuando se perdió)
                    SELECT img.storage_url 
                    FROM Images img 
                    INNER JOIN Posts p_orig ON img.post_id = p_orig.post_id 
                    WHERE p_orig.pet_id = pt.pet_id AND p_orig.type != 'Success Story'
                    LIMIT 1
                ) AS image_url,
                -- Imagen de evidencia (la del reencuentro)
                i.storage_url AS evidencia_url
            FROM Posts p
            INNER JOIN Pets pt ON p.pet_id = pt.pet_id
            LEFT JOIN Images i ON p.post_id = i.post_id
            WHERE p.type = 'Success Story'
            ORDER BY p.date DESC;
        `;

        const [results] = await pool.query(sql);
        res.json(results);
    } catch (err) {
        console.error("Error al obtener casos de éxito:", err);
        res.status(500).json({ error: "Error interno" });
    }
});

export default router;