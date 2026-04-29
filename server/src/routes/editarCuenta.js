import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/:user_id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT name, email, phone_num, description FROM Users WHERE user_id = ?`,
      [req.params.user_id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
  
      const {
        name,
        email,
        phoneNumber, 
        description,
      } = req.body;

      // 1. Busca el usuario usando el email para obtener su user_id
      const [emailResult] = await conn.execute(
        `SELECT user_id FROM Users WHERE email = ?;`,
        [email]
      );

      if (emailResult.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado con ese email." });
      }

      const id = emailResult[0].user_id;

      // 2. Hacer la Actualización de campos
      const [updateResult] = await conn.execute(
        `UPDATE Users 
         SET name = ?, email = ?, phone_num = ?, description = ? 
         WHERE user_id = ?;`,
        [name, email, phoneNumber, description, id]
      );

      await conn.commit();

      res.status(200).json({ 
        user_id: id, 
        message: "Perfil actualizado correctamente",
        cambios: updateResult.changedRows > 0 
      });
  
    } catch (err) {
      await conn.rollback();
      console.error(err);
      res.status(500).json({
        error: "Error editando el perfil.",
        detail: err.message,
        code: err.code
      });
    } finally {
      conn.release();
    }
  });

export default router;