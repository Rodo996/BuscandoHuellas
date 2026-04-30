import { Router } from 'express';
import pool from '../db.js';
import jwt from 'jsonwebtoken';      
import { enviarCorreo, plantillas } from '../services/notificaciones.js';

const router = Router();

// 1. Ruta principal para CREAR LA CUENTA
router.post("/", async (req, res) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
  
      const {
        email,
        name,
        password
      } = req.body;
  
      // Busca si el email ya existe
      const [emailResult] = await conn.execute(
        `SELECT user_id FROM Users WHERE email = ?;`,
        [email]
      );
      
      if (emailResult.length > 0) {
        throw new Error("El correo ya está registrado"); 
      }
  
      // Insertar el usuario (Por defecto verificado = FALSE)
      const [insertResult] = await conn.execute(
        `INSERT INTO Users (email, password, name)
          VALUES (?, ?, ?);`,
        [email, password, name]
      );

      const user_id = insertResult.insertId;
      
      // Token : expira en 2 horas
      const token = jwt.sign(
        { user_id: user_id, email: email }, 
        process.env.JWT_SECRET, 
        { expiresIn: '2h' }
      );

      // Link hacia el endpoint de verificación (ruta de abajo)
      const urlConfirmacion = `http://localhost:3000/api/crear-cuenta/verificar/${token}`;

      // Enviar el correo
      const { subject, html } = plantillas.bienvenida(name, urlConfirmacion);
      await enviarCorreo({ to: email, subject, html });

      await conn.commit();
      
      res.status(201).json({ 
          message: "Cuenta creada. Por favor revisa tu correo para verificarla.",
          user_id: user_id 
      });
  
    } catch (err) {
      await conn.rollback();
      console.error(err);
      res.status(500).json({
        error: "Error al crear la cuenta, email de usuario repetido.", 
        detail: err.message,
        code: err.code
      });
    } finally {
      conn.release();
    }
});

// 2. NUEVA RUTA: Para procesar el clic del correo
router.get("/verificar/:token", async (req, res) => {
    const { token } = req.params;
    const conn = await pool.getConnection();

    try {
        // Token validación (con expiracion)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Actualizar el status en la base de datos
        await conn.execute(
            `UPDATE Users SET verified = TRUE WHERE user_id = ?;`,
            [decoded.user_id]
        );

        // Redireccion a login
        res.redirect('http://localhost:5173/perfil/iniciar_sesion');

    } catch (err) {
        console.error("Error de verificación:", err.message);
        res.status(400).send(`
            <div style="text-align: center; padding: 50px;">
                <h1 style="color: #0D3B66;">El enlace ha expirado o es inválido</h1>
                <p>Por favor, intenta registrarte de nuevo.</p>
            </div>
        `);
    } finally {
        conn.release();
    }
});

export default router;