require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Проверка соединения
async function testConnection() {
    await pool.query('SELECT 1');
    console.log('Ühendus olemas');
}
testConnection();

// Получить все новости
async function getNews() {
    const [rows] = await pool.query('SELECT * FROM news.ejs ORDER BY id DESC');
    return rows;
}

// Получить новость по id
async function getNewsById(id) {
    const [rows] = await pool.query('SELECT * FROM news.ejs WHERE id = ?', [id]);
    return rows[0];
}

// Добавить новость
async function createNews(title, content, image = null) {
    await pool.execute('INSERT INTO news.ejs (title, content, image) VALUES (?, ?, ?)', [title, content, image]);
}

// Обновить новость
async function updateNews(id, title, content, image = null) {
    await pool.execute('UPDATE news.ejs SET title = ?, content = ?, image = ? WHERE id = ?', [title, content, image, id]);
}

// Удалить новость
async function deleteNews(id) {
    const [result] = await pool.query('DELETE FROM news.ejs WHERE id = ?', [id]);
    return result.affectedRows > 0;
}

module.exports = { getNews, getNewsById, createNews, updateNews, deleteNews };
