import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const {
      // Mascota
      name, breed_id, is_mixed_breed, sex, size, has_tail,
      distinctive_features, color_ids, disability_ids,
      // Ubicación
      zip_code, street, lat, lng,
      // Post
      user_id, type,
    } = req.body;

    // 1. Insertar Pets
    const [petResult] = await conn.execute(
      `INSERT INTO Pets (breed_id, name, is_mixed_breed, sex, size, has_tail, distinctive_features)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [breed_id, name, is_mixed_breed, sex, size, has_tail, distinctive_features]
    );
    const pet_id = petResult.insertId;

    // 2. Colores (tabla intermedia Pet_Colors)
    for (const color_id of color_ids) {
      await conn.execute(
        `INSERT INTO Pet_Colors (pet_id, color_id) VALUES (?, ?)`,
        [pet_id, color_id]
      );
    }

    // 3. Discapacidades (tabla intermedia Pet_Disabilities)
    for (const disability_id of disability_ids) {
      await conn.execute(
        `INSERT INTO Pet_Disabilities (pet_id, disability_id) VALUES (?, ?)`,
        [pet_id, disability_id]
      );
    }

    // 4. Insertar Location
    const [locResult] = await conn.execute(
      `INSERT INTO Locations (zip_code, street, lat, lng) VALUES (?, ?, ?, ?)`,
      [zip_code, street, lat, lng]
    );
    const location_id = locResult.insertId;

    // 5. Insertar Post
    const [postResult] = await conn.execute(
      `INSERT INTO Posts (user_id, pet_id, location_id, type) VALUES (?, ?, ?, ?)`,
      [user_id, pet_id, location_id, type]
    );

    await conn.commit();
    res.status(201).json({ post_id: postResult.insertId });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({
      error: "Error al crear la publicación",
      detail: err.message,
      code: err.code
    });
  } finally {
    conn.release();
  }
});

export default router;