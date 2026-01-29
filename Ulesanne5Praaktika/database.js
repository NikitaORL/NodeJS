const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'ulesanne5User',
    password: '1234',
    database: 'ulesanne5praaktika'
});

// Получение пользователя по имени
async function getUserByUsername(username) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
}

module.exports = { getUserByUsername };
