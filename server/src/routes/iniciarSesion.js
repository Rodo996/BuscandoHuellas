import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
    const conn = await pool.getConnection();
    try {
      // Para un simple SELECT no es estrictamente necesario el beginTransaction(), 
      // pero no hace daño dejarlo si planeas hacer UPDATEs aquí en el futuro.
      
      const {
        email,
        password
      } = req.body;

      const [loginResult] = await conn.execute(
        `SELECT user_id, verificado 
        FROM Users 
        WHERE email = ? AND password = ?;`,
        [email, password]
      );

      // Arreglo vacío, el correo o la contraseña están mal
      if (loginResult.length === 0) {
        return res.status(401).json({ error: "Correo o contraseña incorrectos." });
      }

      const user = loginResult[0];

      // 2. Comprobamos si ya verificó su correo (si si, 1)
      if (user.verificado === 0) {
        return res.status(403).json({ 
          error: "Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada." 
        });
      }

      // 3. Si existe, la contraseña está bien y SÍ está verificado, le damos acceso
      res.status(200).json({
        message: "Inicio de sesión exitoso",
        user_id: user.user_id
      });

    } catch (err) {
      console.error("Error en login:", err);
      res.status(500).json({ 
        error: "Error interno del servidor", 
        detail: err.message 
      });
    } finally {
      conn.release();
    }
});

export default router;