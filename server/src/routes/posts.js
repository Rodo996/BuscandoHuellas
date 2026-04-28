import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const {
      name, breed_id, is_mixed_breed, sex, size, has_tail,
      distinctive_features, color_ids, disability_ids,
      zip_code, street, lat, lng, user_id, type,
    } = req.body;

    if (zip_code) {
      await conn.execute(
        `INSERT IGNORE INTO Zip_Codes (zip_code) VALUES (?)`,
        [zip_code]
      );
    }

    await conn.execute(
      `CALL sp_crear_publicacion(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @post_id, @pet_id)`,
      [name, breed_id, is_mixed_breed, sex, size, has_tail,
        distinctive_features, zip_code, street, lat, lng, user_id, type]
    );

    const [[result]] = await conn.execute(
      `SELECT @post_id AS post_id, @pet_id AS pet_id`
    );
    const post_id = result.post_id;
    const pet_id = result.pet_id;

    // Colores y discapacidades
    for (const color_id of color_ids)
      await conn.execute(
        `INSERT INTO Pet_Colors (pet_id, color_id) VALUES (?, ?)`,
        [pet_id, color_id]
      );

    for (const disability_id of disability_ids)
      await conn.execute(
        `INSERT INTO Pet_Disabilities (pet_id, disability_id) VALUES (?, ?)`,
        [pet_id, disability_id]
      );

    res.status(201).json({ post_id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear la publicación", detail: err.message });
  } finally {
    conn.release();
  }
});

export default router;