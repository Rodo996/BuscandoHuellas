import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import mysql from 'mysql2';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

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

// Endpoint para obtener las mascotas con su información relacionada
app.get('/api/mascotas', (req, res) => {
    const sql = `
        SELECT 
            p.pet_id AS id, 
            p.name, 
            b.breed_name AS raza, 
            CASE 
                WHEN p.sex = 'Male' THEN 'Macho' 
                WHEN p.sex = 'Female' THEN 'Hembra' 
                ELSE 'Otro' 
            END AS sexo, 
            CASE 
                WHEN p.size = 'Small' THEN 'Pequeño' 
                WHEN p.size = 'Medium' THEN 'Mediano' 
                WHEN p.size = 'Large' THEN 'Grande' 
                ELSE 'Gigante' 
            END AS tamano,
            CASE 
                WHEN post.type = 'Lost' THEN 'Extraviado' 
                WHEN post.type = 'Spotted' THEN 'Avistado' 
                WHEN post.type = 'Sheltered' THEN 'Alojado'
                ELSE 'Exitoso' 
            END AS estado, 
            loc.street AS ubicacion,
            'https://placedog.net/500' AS img, 
            1 AS tieneEtiqueta
        FROM Pets p
        LEFT JOIN Breeds b ON p.breed_id = b.breed_id
        LEFT JOIN Posts post ON p.pet_id = post.pet_id
        LEFT JOIN Locations loc ON post.location_id = loc.location_id
        GROUP BY 
            p.pet_id, 
            p.name, 
            b.breed_name, 
            p.sex, 
            p.size, 
            post.type, 
            loc.street; -- Agregamos todas las columnas descriptivas aquí
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).json({ error: "Error de DB" });
        }
        res.json(results);
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});