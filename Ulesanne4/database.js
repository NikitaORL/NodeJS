require('dotenv').config();
const mysql = require('mysql2/promise'); // Настройки базы данных

// Создание подключения к базе данных
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Проверка подключения к базе данных
async function testConnection() {
    await pool.query('SELECT 1');
    console.log('Connection exists');
}

testConnection();

// Получение всех новостей
async function getNews() {
    const [rows] = await pool.query('SELECT * FROM news');
    console.log(rows);
    return rows;
}

// Получение одной новости по ID
async function getNewsById(id) {
    const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
    return rows[0];
}

module.exports = { getNews, getNewsById };
