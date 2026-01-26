require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const { getNews, getNewsById, createNews, updateNews, deleteNews } = require('./database');
const { upload } = require('./middleware');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads')); // для доступа к файлам

app.set('view engine', 'ejs');

// -------------------------
// Главная страница
// -------------------------
app.get('/', async (req, res) => {
    const news = await getNews();
    res.render('index', {
        title: 'Avaleht',
        news,
        msg: req.query.msg || ''
    });
});

// -------------------------
// Форма добавления новости (GET)
// -------------------------
app.get('/news/create', (req, res) => {
    res.render('new_create', { title: 'Lisa Uudis', errors: [], values: {} });
});

// -------------------------
// Обработка добавления новости (POST)
// -------------------------
app.post(
    '/news/create',
    upload.single('image'),
    body('title').trim().notEmpty().withMessage('Pealkiri on kohustuslik'),
    body('content').trim().notEmpty().withMessage('Sisu on kohustuslik'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) fs.unlinkSync(path.join('uploads', req.file.filename));
            return res.render('new_create', { title: 'Lisa Uudis', errors: errors.array(), values: req.body });
        }
        const { title, content } = req.body;
        const imagePath = req.file ? req.file.filename : null;
        await createNews(title, content, imagePath);
        res.redirect('/?msg=created');
    }
);

// -------------------------
// Просмотр новости
// -------------------------
app.get('/news/:id', async (req, res) => {
    const id = req.params.id;
    const news = await getNewsById(id);
    if (!news) return res.status(404).render('404', { title: 'Lehte ei leitud' });
    res.render('news', { title: news.title, news });
});

// -------------------------
// Форма редактирования новости (GET)
// -------------------------
app.get('/news/:id/edit', async (req, res) => {
    const id = req.params.id;
    const news = await getNewsById(id);
    if (!news) return res.status(404).render('404', { title: 'Lehte ei leitud' });
    res.render('edit', { title: 'Muuda uudist', news, errors: [], values: news });
});

// -------------------------
// Обработка редактирования новости (POST)
// -------------------------
app.post(
    '/news/:id/edit',
    upload.single('image'),
    body('title').trim().notEmpty().withMessage('Pealkiri on kohustuslik'),
    body('content').trim().notEmpty().withMessage('Sisu on kohustuslik'),
    async (req, res) => {
        const id = req.params.id;
        const news = await getNewsById(id);
        if (!news) return res.status(404).render('404', { title: 'Lehte ei leitud' });

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) fs.unlinkSync(path.join('uploads', req.file.filename));
            return res.render('edit', { title: 'Muuda uudist', news, errors: errors.array(), values: req.body });
        }

        let image = news.image;
        if (req.file) {
            if (news.image && fs.existsSync(path.join('uploads', news.image))) {
                fs.unlinkSync(path.join('uploads', news.image));
            }
            image = req.file.filename;
        }

        const { title, content } = req.body;
        await updateNews(id, title, content, image);
        res.redirect(`/news/${id}`);
    }
);

// -------------------------
// Удаление новости (POST)
// -------------------------
app.post('/news/delete', async (req, res) => {
    const { id } = req.body;
    const news = await getNewsById(id);

    if (news && news.image && fs.existsSync(path.join('uploads', news.image))) {
        fs.unlinkSync(path.join('uploads', news.image));
    }

    const deleted = await deleteNews(id);
    if (deleted) res.redirect('/?msg=deleted');
    else res.redirect('/?msg=delete_failed');
});

// -------------------------
// 404 страница
// -------------------------
app.use((req, res) => {
    res.status(404).render('404', { title: 'Lehte ei leitud' });
});

// -------------------------
// Запуск сервера
// -------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server töötab http://localhost:${PORT}`));
