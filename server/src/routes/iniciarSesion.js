import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
    const conn = await pool.getConnection();
    try {
      const { email, password } = req.body;

      // 1. Buscamos al usuario, su contraseña Y su estado de verificación
      const [loginResult] = await conn.execute(
        `SELECT user_id, verified 
         FROM Users 
         WHERE email = ? AND password = ?;`,
        [email, password]
      );

      // 2. Si no encuentra nada, el correo o la clave están mal
      if (loginResult.length === 0) {
        return res.status(401).json({ 
          error: "Credenciales incorrectas." 
        });
      }

      const user = loginResult[0];

      // 3. BLOQUEO REAL A PRUEBA DE BALAS: 
      // Convertimos a número para asegurar que atrape el 0 o false
      if (Number(user.verified) === 0 || !user.verified) {
        return res.status(403).json({ 
          error: "Tu cuenta aún no ha sido verificada. Revisa tu correo electrónico." 
        });
      }

      // 4. Si es 1 (verificado), dejamos loguear
      res.status(200).json({
        message: "Inicio de sesión exitoso",
        user_id: user.user_id
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ 
        error: "Error interno del servidor.",
        detail: err.message
      });
    } finally {
      conn.release();
    }
});

export default router;