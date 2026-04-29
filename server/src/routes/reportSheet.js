import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const sql = `
            SELECT 
                p.pet_id AS id, 
                p.name,
                sp.species_name AS especie,
                b.breed_name AS raza,
                p.is_mixed_breed AS esCruza,
                p.has_tail AS tieneCola,
                p.distinctive_features AS rasgos,
                u.name AS dueno,         -- ← NUEVO
                CASE 
                    WHEN p.sex = 'Male'         THEN 'Macho' 
                    WHEN p.sex = 'Female'       THEN 'Hembra' 
                    ELSE 'Otro' 
                END AS sexo, 
                CASE 
                    WHEN p.size = 'Extra Small' THEN 'Muy Pequeño'
                    WHEN p.size = 'Small'       THEN 'Pequeño' 
                    WHEN p.size = 'Medium'      THEN 'Mediano' 
                    WHEN p.size = 'Large'       THEN 'Grande'
                    ELSE 'Gigante' 
                END AS tamano,
                CASE 
                    WHEN post.type = 'Lost'          THEN 'Extraviado' 
                    WHEN post.type = 'Spotted'       THEN 'Avistado' 
                    WHEN post.type = 'Sheltered'     THEN 'Alojado'
                    ELSE 'Exitoso' 
                END AS estado,
                post.date AS fecha,
                loc.street AS ubicacion,
                loc.lat AS latitud,
                loc.lng AS longitud,
                MIN(pi.storage_url) AS img,
                1 AS tieneEtiqueta,
                (
                    SELECT JSON_ARRAYAGG(JSON_OBJECT('id', c.color_id, 'nombre', c.color_name, 'hex', c.hex_code))
                    FROM Pet_Colors pc
                    JOIN Colors c ON pc.color_id = c.color_id
                    WHERE pc.pet_id = p.pet_id
                ) AS colores,
                (
                    SELECT JSON_ARRAYAGG(JSON_OBJECT('id', d.disability_id, 'nombre', d.disability_name))
                    FROM Pet_Disabilities pd
                    JOIN Disabilities d ON pd.disability_id = d.disability_id
                    WHERE pd.pet_id = p.pet_id
                ) AS discapacidades

            FROM Pets p
            LEFT JOIN Breeds    b    ON p.breed_id    = b.breed_id
            LEFT JOIN Species   sp   ON b.species_id  = sp.species_id
            LEFT JOIN Posts     post ON post.post_id  = (
                SELECT post_id FROM Posts
                WHERE pet_id = p.pet_id
                    AND type != 'Success Story'   
                ORDER BY date DESC
                LIMIT 1
            )
            LEFT JOIN Users     u    ON post.user_id  = u.user_id    
            LEFT JOIN Locations loc  ON post.location_id = loc.location_id
            LEFT JOIN Images    pi   ON post.post_id     = pi.post_id

            GROUP BY
                p.pet_id, p.name, sp.species_name, b.breed_name,
                p.is_mixed_breed, p.has_tail, p.distinctive_features,
                p.sex, p.size, post.type, post.date,
                loc.street, loc.lat, loc.lng,
                u.name                  

            ORDER BY post.date DESC;
        `;

        const [results] = await pool.query(sql);

        const parsed = results.map(row => ({
            ...row,
            colores: typeof row.colores === "string"
                ? JSON.parse(row.colores)
                : (row.colores ?? []),
            discapacidades: typeof row.discapacidades === "string"
                ? JSON.parse(row.discapacidades)
                : (row.discapacidades ?? []),
            esCruza:   row.esCruza   === 1,
            tieneCola: row.tieneCola === 1,
        }));

        res.json(parsed);
    } catch (err) {
        console.error("Error al obtener mascotas:", err);
        res.status(500).json({ error: "Error de servidor", details: err.message });
    }
});

export default router;