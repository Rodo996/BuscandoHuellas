import { Router } from "express";
import pool from "../db.js";
import transporter from "../mailer.js";

const router = Router();

router.post("/", async (req, res) => {
  console.log('[Posts] user_id recibido:', req.body.user_id);
  const conn = await pool.getConnection();
  try {
    const {
      name, breed_id, is_mixed_breed, sex, size, has_tail,
      distinctive_features, color_ids, disability_ids,
      zip_code, municipality, street, lat, lng, user_id, type,
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

    await conn.commit();
    conn.release();

    pool.execute(`CALL sp_buscar_coincidencias(?)`, [post_id])
      .then(async () => {
        console.log('[Matching] SP ejecutado para post_id:', post_id);

        const [notifs] = await pool.execute(`
      SELECT n.content, u.email, u.name
      FROM Notifications n
      JOIN Users u ON n.user_id = u.user_id
      WHERE n.type = 'post'
        AND n.date >= NOW() - INTERVAL 10 SECOND
        AND n.is_read = FALSE
    `);

        console.log('[Matching] Notificaciones encontradas:', notifs.length, notifs);

        for (const notif of notifs) {
          try {
            const info = await transporter.sendMail({ // ← await aquí
              from: process.env.EMAIL_USER,
              to: notif.email,
              subject: '🐾 Posible coincidencia encontrada — Buscando Huellas',
              html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
              <h2 style="color: #0D3B66;">¡Hola ${notif.name}!</h2>
              <p>${notif.content}</p>
              <a href="http://localhost:5173/buscar"
                 style="display:inline-block; padding:12px 24px; background:#F4D35E;
                        color:#0D3B66; font-weight:bold; border-radius:8px;
                        text-decoration:none;">
                Ver publicaciones
              </a>
            </div>
          `
            });
            console.log('[Mail] Enviado a:', notif.email, '→', info.response);
          } catch (mailErr) {
            console.error('[Mail] Error enviando a:', notif.email, mailErr.message);
          }
        }
      })
      .catch(err => console.error('[Matching] Error en SP:', err));

    res.status(201).json({ post_id });

  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error(err);
    res.status(500).json({ error: "Error al crear la publicación", detail: err.message });
  }
});

export default router;