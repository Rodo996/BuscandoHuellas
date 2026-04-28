import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const sql = `
            SELECT 
                p.pet_id AS id, 
                p.name, 
                b.breed_name AS raza, 
                CASE 
                    WHEN p.sex = 'Male' THEN 'Macho' 
                    WHEN p.sex = 'Female' THEN 'Hembra' 
                    ELSE 'Otro' 
                END AS sexo, 
                CASE 
                    WHEN p.size = 'Small' THEN 'Pequeño' 
                    WHEN p.size = 'Medium' THEN 'Mediano' 
                    WHEN p.size = 'Large' THEN 'Grande' 
                    ELSE 'Gigante' 
                END AS tamano,
                CASE 
                    WHEN post.type = 'Lost' THEN 'Extraviado' 
                    WHEN post.type = 'Spotted' THEN 'Avistado' 
                    WHEN post.type = 'Sheltered' THEN 'Alojado'
                    ELSE 'Exitoso' 
                END AS estado, 
                loc.street AS ubicacion,
                MIN(pi.storage_url) AS img, -- Confirmado: el campo es storage_url
                1 AS tieneEtiqueta
            FROM Pets p
            LEFT JOIN Breeds b ON p.breed_id = b.breed_id
            LEFT JOIN Posts post ON p.pet_id = post.pet_id
            LEFT JOIN Locations loc ON post.location_id = loc.location_id
            LEFT JOIN Images pi ON post.post_id = pi.post_id 
            GROUP BY 
                p.pet_id, 
                p.name, 
                b.breed_name, 
                p.sex, 
                p.size, 
                post.type, 
                loc.street;
        `;

        const [results] = await pool.query(sql);
        res.json(results);
    } catch (err) {
        console.error("Error al obtener mascotas:", err);
        res.status(500).json({ error: "Error de servidor", details: err.message });
    }
});

export default router;