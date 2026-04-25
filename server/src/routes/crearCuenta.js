import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.post("/", async (req, res) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
  
      const {
        //user
        email,
        name,
        password
      } = req.body;
  
      // 1. Busca si el email ya existe en la base de datos
      const [emailResult] = await conn.execute(
        `SELECT user_id FROM Users WHERE email = ?;`,
        [email]
      );
      
      // Si emailResult tiene algún registro, el correo ya está en uso
      if (emailResult.length > 0) {
        // Esto lanza un error y manda la ejecución directo al catch
        throw new Error("El correo ya está registrado"); 
      }
  
      // 2. Insertar los campos llenados (aquí guardamos el resultado en insertResult)
      const [insertResult] = await conn.execute(
        `INSERT INTO Users (email, password, name)
          VALUES (?, ?, ?);`,
        [email, password, name]
      );
  
      await conn.commit();
      
      // 3. Devolvemos el insertId del INSERT que acabamos de hacer
      res.status(201).json({ user_id: insertResult.insertId });
  
    } catch (err) {
      await conn.rollback();
      console.error(err);
      res.status(500).json({
        error: "Error al crear la cuenta, email de usuario repetido.", //reflejar en front: "ya existe una cuenta con ese correo."
        detail: err.message,
        code: err.code
      });
    } finally {
      conn.release();
    }
  });

export default router;