import express from 'express';
import cors from 'cors';
import pool from './db.js';
import postsRouter from './routes/posts.js';
import catalogsRouter from './routes/catalogs.js';
import reportSheetRouter from './routes/reportSheet.js';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

pool.getConnection()
  .then(conn => {
    console.log('Conectado a MySQL');
    conn.release();
  })
  .catch(err => console.error('Error de conexión:', err.message));

app.use('/api/posts', postsRouter);
app.use('/api/catalogs', catalogsRouter);


app.listen(process.env.PORT, () =>
  console.log(`Server corriendo en http://localhost:${process.env.PORT}`)
);