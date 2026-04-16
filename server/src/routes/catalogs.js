import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/species', async (req, res) => {
  const [rows] = await pool.execute('SELECT species_id, species_name FROM Species WHERE approved = TRUE');
  res.json(rows);
});

router.get('/breeds/:species_id', async (req, res) => {
  const [rows] = await pool.execute('SELECT breed_id, breed_name FROM Breeds WHERE species_id = ? AND approved = TRUE', [req.params.species_id]);
  res.json(rows);
});

router.get('/colors', async (req, res) => {
  const [rows] = await pool.execute('SELECT color_id, color_name, hex_code FROM Colors');
  res.json(rows);
});

router.get('/disabilities', async (req, res) => {
  const [rows] = await pool.execute('SELECT disability_id, disability_name FROM Disabilities');
  res.json(rows);
});

export default router;
