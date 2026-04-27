import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(path.join(process.cwd(), process.env.DB_SSL_CERT))
  },
  timezone: "-06:00",
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;