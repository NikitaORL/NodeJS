// Импорты и настройки
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs'); // bcryptjs для Windows
const { getUserByUsername } = require('./database');
const { requireLogin, bypassLogin } = require('./middleware');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60*60*1000, httpOnly: true, sameSite: 'lax' }
}));

app.set('view engine', 'ejs');
app.set('views', './views');



// Login-leht
app.get('/login', bypassLogin, (req, res) => {
    res.render('login.ejs', {
        title: 'Logi sisse',
        msg: req.query.msg === 'login_failed' ? 'Vale kasutajanimi või parool' : null,
        errors: []
    });
});


app.post('/login',
    body('username').trim().notEmpty().withMessage('Kasutajanimi on kohustuslik'),
    body('password').trim().notEmpty().withMessage('Parool on kohustuslik'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('login.ejs', { title: 'Logi sisse', msg: 'Väljad on kohustuslikud', errors: errors.array() });
        }

        const { username, password } = req.body;

        let user;
        try {
            user = await getUserByUsername(username);
        } catch (err) {
            console.error('DB Error:', err);
            return res.render('login.ejs', { title: 'Logi sisse', msg: 'Произошла ошибка при входе в систему', errors: [] });
        }

        if (!user) return res.render('login.ejs', { title: 'Logi sisse', msg: 'Vale kasutajanimi või parool', errors: [] });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.render('login.ejs', { title: 'Logi sisse', msg: 'Vale kasutajanimi või parool', errors: [] });

        req.session.user = { id: user.id, username: user.username, role: user.role };
        res.redirect('/admin?msg=login_success');
    }
);

// Admin leht
app.get('/admin', requireLogin, (req, res) => {
    res.render('admin', {
        title: 'Admin leht',
        msg: req.query.msg === 'login_success' ? 'Olete edukalt sisse logitud' : null,
        user: req.session.user
    });
});


// ------------------ Logout ------------------
app.get('/logout', requireLogin, (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/login');
});

// -------------------------------------------------


app.listen(PORT, () => {
    console.log(`Server töötab http://localhost:${PORT}`);
});
