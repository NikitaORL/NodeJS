require('dotenv').config();
const express = require('express');
const session = require('express-session');

const {
    getNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews
} = require('./database');

const app = express();
const PORT = 3001;

app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'supersecret123',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000 // 1 час
    }
}));

app.set('view engine', 'ejs');
app.set('views', './views');


// ================== ПОЛЬЗОВАТЕЛИ В КОДЕ ==================

const users = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'user', password: 'user123', role: 'user' }
];

// ================== MIDDLEWARE ==================

function requireLogin(req, res, next) {
    if (!req.session.user) return res.redirect('/login');
    next();
}

function requireAdmin(req, res, next) {
    if (req.session.user.role !== 'admin') return res.send('Ligipääs keelatud');
    next();
}

// ================== LOGIN ==================

app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u =>
        u.username === username && u.password === password
    );

    if (!user) {
        return res.render('login', { error: 'Vale kasutajanimi või parool' });
    }

    req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role
    };

    res.redirect('/');
});

// ================== LOGOUT ==================

app.get('/logout', requireLogin, (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/login');
});

// ================== PEALEHT ==================

app.get('/', requireLogin, async (req, res) => {
    const news = await getNews();
    res.render('index', {
        news,
        user: req.session.user,
        msg: req.query.msg || ''
    });
});

// ================== VAATA UUDIST ==================

app.get('/news/:id', requireLogin, async (req, res) => {
    const news = await getNewsById(req.params.id);
    if (!news) return res.status(404).render('404');
    res.render('news', { news });
});

// ================== CREATE (ADMIN) ==================

app.get('/news/create', requireLogin, requireAdmin, (req, res) => {
    res.render('create', { errors: [], values: {} });
});

app.post('/news/create', requireLogin, requireAdmin, async (req, res) => {
    await createNews(req.body.title, req.body.content);
    res.redirect('/?msg=created');
});

// ================== EDIT (ADMIN) ==================

app.get('/news/:id/edit', requireLogin, requireAdmin, async (req, res) => {
    const news = await getNewsById(req.params.id);
    if (!news) return res.status(404).render('404');
    res.render('edit', { news, errors: [], values: news });
});

app.post('/news/:id/edit', requireLogin, requireAdmin, async (req, res) => {
    await updateNews(req.params.id, req.body.title, req.body.content);
    res.redirect('/');
});

// ================== DELETE (ADMIN) ==================

app.post('/news/delete', requireLogin, requireAdmin, async (req, res) => {
    const ok = await deleteNews(req.body.id);
    if (ok) res.redirect('/?msg=deleted');
    else res.redirect('/?msg=delete_failed');
});

// ================== 404 ==================

app.use((req, res) => {
    res.status(404).render('404');
});

app.listen(PORT, () => {
    console.log(`Server töötab: http://localhost:${PORT}`);
});
