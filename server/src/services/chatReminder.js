import pool from '../db.js';
import { enviarCorreo, plantillas } from './notifications.js';

export async function enviarRecordatorios() {
    try {
        // Buscar mensajes sin respuesta en más de 24 horas
        const [pendientes] = await pool.execute(`
            SELECT 
                m.chat_id,
                m.user_id AS sender_id,
                m.type,
                m.sent_at,
                u_sender.name AS sender_name,
                u_receiver.email AS receiver_email,
                u_receiver.name AS receiver_name
            FROM Messages m
            JOIN Chats c ON c.chat_id = m.chat_id
            JOIN Users u_sender ON u_sender.user_id = m.user_id
            JOIN Users u_receiver ON u_receiver.user_id = 
                CASE WHEN c.user_sender = m.user_id 
                     THEN c.user_receiver 
                     ELSE c.user_sender 
                END
            WHERE m.sent_at <= NOW() - INTERVAL 1 MINUTE
              AND c.status = 'Open'
              AND m.type IN ('Proof of Ownership', 'Arrange Meeting')
              AND m.message_no = (
                  SELECT MAX(m2.message_no) 
                  FROM Messages m2 
                  WHERE m2.chat_id = m.chat_id
              )
        `);

        for (const msg of pendientes) {
            const accionTexto = msg.type === 'Proof of Ownership'
                ? 'una solicitud de prueba de propiedad'
                : 'una propuesta de encuentro';

            const linkChat = `http://localhost:5173/chat/${msg.sender_id}`;

            const { subject, html } = plantillas.recordatorio_chat(
                msg.sender_name,
                accionTexto,
                linkChat
            );

            await enviarCorreo({
                to: msg.receiver_email,
                subject,
                html
            });

            console.log('[Recordatorio] Enviado a:', msg.receiver_email);
        }
    } catch (err) {
        console.error('[Recordatorio] Error:', err.message);
    }
}