import { Router } from "express";
import pool from "../db.js";
import { procesarCoincidencias } from '../services/notifications.js';
import transporter from '../mailer.js'; // <-- IMPORTACIÓN DEL MAILER AGREGADA

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

    // ====================================================================
    // INICIO DEL SISTEMA DE NOTIFICACIONES HARDCODEADO (30s y 60s)
    // ====================================================================
    const petName = name || 'Mascota';

    // 1. AVISO PREVIO (A los 30 segundos)
    setTimeout(() => {
      const mailOptionsAviso = {
        from: process.env.EMAIL_USER,
        to: finalEmail, // Se envía al correo de contacto final
        subject: `Aviso: Tu publicacion de ${petName} caducara pronto`,
        html: `
          <div style="font-family: 'Poppins', sans-serif; text-align: center; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #0D3B66;">Atencion</h2>
            <p>Tu publicacion de <strong>${petName}</strong> sera dada de baja automaticamente en 30 segundos para mantener el sitio actualizado.</p>
            <p style="font-size: 12px; color: #666;">Este es un correo de prueba del sistema.</p>
          </div>
        `
      };
      transporter.sendMail(mailOptionsAviso).catch(console.error);
    }, 30000); // 30 segundos

    // 2. NOTIFICACION DE CIERRE AL MINUTO (Formato de tu Screenshot)
    setTimeout(() => {
      // Esta URL llevará a la ruta de confirmación que agregamos abajo
      const urlConfirmacion = `http://localhost:3000/api/posts/confirmar-baja/${post_id}`;

      const mailOptionsFinal = {
        from: process.env.EMAIL_USER,
        to: finalEmail,
        subject: 'Ayudanos a mantenernos actualizados',
        html: `
          <div style="max-width: 500px; margin: auto; font-family: 'Poppins', Arial, sans-serif; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
            <div style="background-color: #F4D35E; padding: 20px; text-align: center;">
              <h2 style="color: #0D3B66; margin: 0; font-size: 24px; font-weight: bold;">Aviso del Sistema</h2>
            </div>
            
            <div style="padding: 30px; text-align: center;">
              <h2 style="color: #0D3B66; font-weight: 800; margin-bottom: 10px;">Ayudanos a mantenernos actualizados</h2>
              <p style="color: #4B5563; font-size: 14px; line-height: 1.5;">
                Tu publicacion de <strong>${petName}</strong> ha cumplido un mes (prueba: 1 min) activa. Por favor, decide si deseas mantenerla o darla de baja.
              </p>

              <div style="background-color: #F9FAFB; border-radius: 12px; padding: 15px; margin: 20px 0; display: inline-block; width: 80%; border: 1px solid #F3F4F6;">
                 <p style="margin: 5px 0; color: #1F2937;"><strong>Nombre:</strong> ${petName}</p>
                 <p style="margin: 5px 0; color: #6B7280; font-size: 13px;">Publicado recientemente</p>
              </div>

              <a href="${urlConfirmacion}" 
                 style="display: block; background-color: #F4D35E; color: #0D3B66; text-decoration: none; padding: 15px; border-radius: 12px; font-weight: 700; font-size: 16px; margin-top: 10px;">
                Dar de baja publicacion
              </a>
            </div>
          </div>
        `
      };
      transporter.sendMail(mailOptionsFinal).catch(console.error);
    }, 60000); // 60 segundos
    // ====================================================================
    // FIN DEL SISTEMA DE NOTIFICACIONES
    // ====================================================================

    res.status(201).json({ post_id });

  } catch (err) {
    if (conn) {
      await conn.rollback();
      conn.release();
    }
    console.error(err);
    res.status(500).json({ error: "Error al crear la publicación", detail: err.message });
  }
});


// =======================================================
// RUTA 2: MOSTRAR LA PANTALLA DE CONFIRMACIÓN DEL CORREO
// =======================================================
router.get("/confirmar-baja/:id", (req, res) => {
  const id = req.params.id;
  res.send(`
      <html>
          <body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f3f4f6;">
              <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <h2 style="color: #0D3B66;">¿Estás seguro?</h2>
                  <p style="color: #666;">Esta acción eliminará permanentemente la publicación.</p>
                  <form action="/api/posts/eliminar/${id}" method="POST" style="margin-top: 20px;">
                      <button type="submit" style="background: #ef4444; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold;">Sí, dar de baja</button>
                      <br><br>
                      <a href="http://localhost:5173" style="color: #0D3B66; text-decoration: none; font-size: 14px;">Cancelar y volver al sitio</a>
                  </form>
              </div>
          </body>
      </html>
  `);
});

// =======================================================
// RUTA 3: EJECUTAR EL 'DROP' (DELETE) EN MYSQL
// =======================================================
router.post("/eliminar/:id", async (req, res) => {
  const id = req.params.id;
  const conn = await pool.getConnection();
  try {
      // Borramos el post usando su ID. (Asume que tu base de datos usa ON DELETE CASCADE para borrar la mascota vinculada)
      await conn.execute("DELETE FROM Posts WHERE post_id = ?", [id]);
      res.send(`
          <div style="font-family: sans-serif; text-align: center; padding: 50px;">
              <h1 style="color: #10B981;">Publicación eliminada con éxito ✅</h1>
              <p>La base de datos ha sido actualizada. Ya puedes cerrar esta ventana.</p>
          </div>
      `);
  } catch (err) {
      console.error(err);
      res.status(500).send("Error al intentar eliminar la publicación.");
  } finally {
      conn.release();
  }
});

export default router;