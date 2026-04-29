import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const sql = `
            SELECT
                p.post_id,
                pt.name AS name,
                p.date AS fecha_recuperacion,
                p.story, -- ¡Aquí agregamos la nueva columna!
                (
                    SELECT i.storage_url 
                    FROM Images i 
                    INNER JOIN Posts p_orig ON i.post_id = p_orig.post_id 
                    WHERE p_orig.pet_id = pt.pet_id 
                    LIMIT 1
                ) AS image_url
            FROM Posts p
            INNER JOIN Pets pt ON p.pet_id = pt.pet_id
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