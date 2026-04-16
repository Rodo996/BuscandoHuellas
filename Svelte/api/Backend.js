import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
//import cors from 'cors';
import mysql from 'mysql2';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
//app.use(cors());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


connection.connect(error => {
    if (error) {
        console.error('Error de conexión', error.message);
        return;
    }
    console.log("Conectada");
});
// ==========================================
// RUTAS PARA CHATS Y MENSAJES
// ==========================================

// 1. Obtener todos los mensajes de un chat específico
app.get('/Messages/:chat_id', (req, res) => {
    const { chat_id } = req.params;

    // Traemos los mensajes ordenados por fecha de envío de más antiguo a más nuevo
    const sql = "SELECT * FROM Messages WHERE chat_id = ? ORDER BY sent_at ASC";

    connection.query(sql, [chat_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al obtener los mensajes", details: err.message });
        }
        res.json(results);
    });
});

// 2. Insertar un nuevo mensaje en un chat
app.post('/Messages', (req, res) => {
    // Extraemos las columnas que definiste en tu tabla Messages
    const { chat_id, user_id, image_id, type, content, meet_lat, meet_lng } = req.body;

    // Asumimos que 'message_no' es Auto Incremental y 'sent_at' tiene un default de CURRENT_TIMESTAMP en tu BD.
    const sql = `
        INSERT INTO Messages 
        (chat_id, user_id, image_id, type, content, meet_lat, meet_lng) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Pasamos los valores. Si alguno no viene (ej. un texto normal no tiene latitud), pasamos null
    const values = [
        chat_id, 
        user_id, 
        image_id || null, 
        type,             // Puede ser: 'texto', 'imagen', 'mapa', 'sistema'
        content, 
        meet_lat || null, 
        meet_lng || null
    ];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al insertar el mensaje", details: err.message });
        }

        res.json({ 
            message: "Mensaje enviado con éxito", 
            message_no: result.insertId 
        });
    });
});
//Obtener usuarios
app.get('/Users', (req, res) => {
    connection.query("SELECT * FROM Users", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

//Insertar usuarios
app.post('/Users', (req, res) => {
    // Extraemos los nombres exactos que definiste en el CREATE TABLE
    const { name, email, phone_num, descripcion } = req.body;

    const sql = "INSERT INTO Users (name, email, phone_num, descripcion) VALUES (?, ?, ?, ?)";

    connection.query(sql, [name, email, phone_num, descripcion], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al insertar", details: err.message });
        }

        res.json({ message: "Usuario agregado con éxito", id: result.insertId });
    });
});

//Actualizar usuarios
// Actualizar usuarios corregido
app.patch('/Users/:id', (req, res) => {
    const { id } = req.params; // Este es el user_id que viene en la URL
    const { name, email, phone_num, descripcion } = req.body;

    // Usamos 'user_id' porque así lo definiste en tu CREATE TABLE
    // Y 'name' en lugar de 'nombre'
    const sql = `
        UPDATE Users 
        SET name = COALESCE(?, name), 
            email = COALESCE(?, email), 
            phone_num = COALESCE(?, phone_num), 
            descripcion = COALESCE(?, descripcion) 
        WHERE user_id = ?
    `;

    const values = [name, email, phone_num, descripcion, id];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al actualizar", details: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario actualizado correctamente" });
    });
});

//Eliminar usuarios
app.delete('/Users/:id', (req, res) => {
    const { id } = req.params;

    // Cambiamos 'id' por 'user_id'
    const sql = "DELETE FROM Users WHERE user_id = ?";

    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al eliminar", details: err.message });
        }

        // Tip pro: Verifica si realmente se borró alguien
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No se encontró el usuario con ese ID" });
        }

        res.json({ message: "Usuario eliminado correctamente" });
    });
});

const PORT = 2026;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});