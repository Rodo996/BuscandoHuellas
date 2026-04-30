import pool from '../db.js';
import transporter from '../mailer.js';

export async function enviarCorreo({ to, subject, html }) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
  console.log('[Mail] Enviado a:', to, '→', info.response);
  return info;
}

export const plantillas = {
  coincidencia: (nombre, contenido) => ({
    subject: '🐾 Posible coincidencia encontrada — Buscando Huellas',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #0D3B66;">¡Hola ${nombre}!</h2>
        <p>${contenido}</p>
        <a href="http://localhost:5173/buscar"
           style="display:inline-block; padding:12px 24px; background:#F4D35E;
                  color:#0D3B66; font-weight:bold; border-radius:8px;
                  text-decoration:none;">
          Ver publicaciones
        </a>
      </div>
    `,
  }),

  bienvenida: (nombre, urlConfirmacion) => ({
    subject: 'Verifica tu cuenta en Buscando Huellas',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #0D3B66;">¡Bienvenido ${nombre}!</h2>
        <p>Casi terminas. Haz clic en el siguiente botón para activar tu cuenta:</p>
        <a href="${urlConfirmacion}"
           style="display:inline-block; padding:12px 24px; background:#F4D35E;
                  color:#0D3B66; font-weight:bold; border-radius:8px;
                  text-decoration:none;">
          Confirmar mi correo
        </a>
        <p style="margin-top:20px; font-size:12px; color:#666;">
          Si no solicitaste esta cuenta, puedes ignorar este mensaje.
        </p>
      </div>
    `,
  }),
};

export async function procesarCoincidencias(post_id) {
  await pool.execute(`CALL sp_buscar_coincidencias(?)`, [post_id]);
  console.log('[Matching] SP ejecutado para post_id:', post_id);

  const [notifs] = await pool.execute(`
    SELECT n.content, u.email, u.name
    FROM Notifications n
    JOIN Users u ON n.user_id = u.user_id
    WHERE n.type = 'post'
      AND n.date >= NOW() - INTERVAL 10 SECOND
      AND n.is_read = FALSE
  `);

  console.log('[Matching] Notificaciones encontradas:', notifs.length);

  for (const notif of notifs) {
    try {
      const { subject, html } = plantillas.coincidencia(notif.name, notif.content);
      await enviarCorreo({ to: notif.email, subject, html });
    } catch (err) {
      console.error('[Mail] Error enviando a:', notif.email, err.message);
    }
  }
}