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
  chat_accion: (nombreRemitente, accion, linkChat) => ({
      subject: `🐾 ${nombreRemitente} te envió una solicitud — Buscando Huellas`,
      html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
              <h2 style="color: #0D3B66;">¡Tienes una nueva solicitud!</h2>
              <p><strong>${nombreRemitente}</strong> te ha enviado: <strong>${accion}</strong></p>
              <a href="${linkChat}"
                style="display:inline-block; padding:12px 24px; background:#F4D35E;
                        color:#0D3B66; font-weight:bold; border-radius:8px;
                        text-decoration:none;">
                  Ver chat
              </a>
          </div>
      `,
  }),

  recordatorio_chat: (nombreRemitente, accion, linkChat) => ({
      subject: `⏰ Recordatorio: tienes un mensaje sin responder — Buscando Huellas`,
      html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
              <h2 style="color: #0D3B66;">No olvides responder</h2>
              <p><strong>${nombreRemitente}</strong> te envió <strong>${accion}</strong> hace más de 24 horas y aún no has respondido.</p>
              <a href="${linkChat}"
                style="display:inline-block; padding:12px 24px; background:#F4D35E;
                        color:#0D3B66; font-weight:bold; border-radius:8px;
                        text-decoration:none;">
                  Ir al chat
              </a>
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
export async function notificarAccionChat(chat_id, sender_id, tipo) {
    try {
        // Obtener datos del chat, remitente y receptor
        const [[chat]] = await pool.execute(
            `SELECT 
                c.chat_id,
                c.user_sender,
                c.user_receiver,
                u_sender.name AS sender_name,
                u_receiver.name AS receiver_name,
                u_receiver.email AS receiver_email
             FROM Chats c
             JOIN Users u_sender ON u_sender.user_id = c.user_sender
             JOIN Users u_receiver ON u_receiver.user_id = c.user_receiver
             WHERE c.chat_id = ?`,
            [chat_id]
        );

        if (!chat) return;

        // El receptor es el que NO envió el mensaje
        const receiverEmail = sender_id === chat.user_sender
            ? chat.receiver_email
            : null;

        // Si el sender es el receiver del chat, buscar el otro usuario
        const [[otroUsuario]] = await pool.execute(
            `SELECT u.email, u.name FROM Users u
             JOIN Chats c ON (c.user_sender = u.user_id OR c.user_receiver = u.user_id)
             WHERE c.chat_id = ? AND u.user_id != ?`,
            [chat_id, sender_id]
        );

        if (!otroUsuario) return;

        const accionTexto = tipo === 'Proof of Ownership'
            ? 'una solicitud de prueba de propiedad'
            : 'una propuesta de encuentro';

        const linkChat = `http://localhost:5173/chat/${sender_id}`;

        const { subject, html } = plantillas.chat_accion(
            chat.sender_name,
            accionTexto,
            linkChat
        );

        await enviarCorreo({ to: otroUsuario.email, subject, html });
        console.log('[Mail] Notificación de chat enviada a:', otroUsuario.email);
    } catch (err) {
        console.error('[Mail] Error en notificarAccionChat:', err.message);
    }
}