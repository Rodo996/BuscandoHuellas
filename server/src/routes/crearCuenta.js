import { Router } from 'express';
import pool from '../db.js';
import nodemailer from 'nodemailer'; 
import jwt from 'jsonwebtoken';      

const router = Router();

// Configuración del transporte de correo (basado en el video)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

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
      await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Verifica tu cuenta en Buscando Huellas',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
                <h2 style="color: #0D3B66;">¡Bienvenido ${name}!</h2>
                <p>Casi terminas. Haz clic en el siguiente botón para activar tu cuenta:</p>
                <a href="${urlConfirmacion}" 
                   style="display: inline-block; padding: 12px 24px; background-color: #F4D35E; color: #0D3B66; text-decoration: none; font-weight: bold; border-radius: 8px;">
                   Confirmar mi correo
                </a>
                <p style="margin-top: 20px; font-size: 12px; color: #666;">
                   Si no solicitaste esta cuenta, puedes ignorar este mensaje.
                </p>
            </div>
          `
      });

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