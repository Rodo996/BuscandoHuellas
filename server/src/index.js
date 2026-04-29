import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from './db.js';
import postsRouter from './routes/posts.js';
import catalogsRouter from './routes/catalogs.js';
import reportSheetRouter from './routes/reportSheet.js';
import crearCuentaRouter from './routes/crearCuenta.js';
import editarCuentaRouter from './routes/editarCuenta.js';
import imagesRouter from './routes/images.js'
import notificationsRouter from './routes/notifications.js'

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
app.use('/api/mascotas', reportSheetRouter);
app.use('/api/crear-cuenta', crearCuentaRouter);
app.use('/api/editar-perfil', editarCuentaRouter);
app.use('/api/images', imagesRouter);
app.use('/api/notifications', notificationsRouter);


app.listen(process.env.PORT, () =>
  console.log(`Server corriendo en http://localhost:${process.env.PORT}`)
);