import { Router } from "express";
import pool from "../db.js";
import { procesarCoincidencias } from '../services/notifications.js';

const router = Router();

router.post("/", async (req, res) => {
  console.log('[Posts] user_id recibido:', req.body.user_id);
  const conn = await pool.getConnection();
  try {
    const {
      name, breed_id, is_mixed_breed, sex, size, has_tail,
      distinctive_features, color_ids, disability_ids,
      zip_code, municipality, street, lat, lng, user_id, type,
      contact_name, contact_email, contact_phone 
    } = req.body;

    await conn.beginTransaction();

    if (zip_code) {
      await conn.execute(
        `INSERT IGNORE INTO Zip_Codes (zip_code, municipality) VALUES (?, ?)`,
        [zip_code, municipality ?? '']
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

    const [[userRow]] = await conn.execute(
      `SELECT name, email, phone_num FROM Users WHERE user_id = ?`,
      [user_id]
    );

    const finalName = contact_name?.trim() || userRow.name;
    const finalEmail = contact_email?.trim() || userRow.email;
    const finalPhone = contact_phone?.trim() || userRow.phone_num || null;

    await conn.execute(
      `UPDATE Posts SET contact_name = ?, contact_email = ?, contact_phone = ? WHERE post_id = ?`,
      [finalName, finalEmail, finalPhone, post_id]
    );

    await conn.commit();
    conn.release();

    procesarCoincidencias(post_id).catch(err => console.error('[Matching] Error:', err));

    res.status(201).json({ post_id });

  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error(err);
    res.status(500).json({ error: "Error al crear la publicación", detail: err.message });
  }
});

export default router;