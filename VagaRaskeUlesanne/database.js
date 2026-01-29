require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// USERS

async function getUserByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
}

// NEWS

async function getNews() {
    const [rows] = await pool.query('SELECT * FROM news ORDER BY id DESC');
    return rows;
}

async function getNewsById(id) {
    const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
    return rows[0];
}

async function createNews(title, content) {
    await pool.execute('INSERT INTO news.ejs (title, content) VALUES (?, ?)', [title, content]);
}

async function updateNews(id, title, content) {
    await pool.execute('UPDATE news.ejs SET title = ?, content = ? WHERE id = ?', [title, content, id]);
}

async function deleteNews(id) {
    const [res] = await pool.query('DELETE FROM news  WHERE id = ?', [id]);
    return res.affectedRows > 0;
}

module.exports = {
    getUserByUsername,
    getNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews
};
