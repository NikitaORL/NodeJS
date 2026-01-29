const express = require('express');
const { body, validationResult } = require('express-validator');
const { getNews, getNewsById, createNews, updateNews, deleteNews } = require('./database');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');


//  страница

app.get('/', async (req, res) => {
    const news = await getNews();
    res.render('index', { news, msg: req.query.msg || '' });
});


// Просмотр новости

app.get('/news/:id', async (req, res) => {
    const news = await getNewsById(req.params.id);
    if (!news) return res.status(404).render('404');
    res.render('news', { news });
});


//  добавления новости

app.get('/add', (req, res) => {
    res.render('add', { errors: [], values: {} });
});

app.post(
    '/add',
    body('title').trim().notEmpty().withMessage('Заголовок обязателен'),
    body('content').trim().notEmpty().withMessage('Содержание обязательно'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.render('add', { errors: errors.array(), values: req.body });
        await createNews(req.body.title, req.body.content);
        res.redirect('/?msg=created');
    }
);


//  редакт новости

app.get('/edit/:id', async (req, res) => {
    const news = await getNewsById(req.params.id);
    if (!news) return res.status(404).render('404');
    res.render('edit', { news, errors: [], values: news });
});

app.post(
    '/edit/:id',
    body('title').trim().notEmpty().withMessage('Заголовок обязателен'),
    body('content').trim().notEmpty().withMessage('Содержание обязательно'),
    async (req, res) => {
        const news = await getNewsById(req.params.id);
        if (!news) return res.status(404).render('404');

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.render('edit', { news, errors: errors.array(), values: req.body });

        await updateNews(req.params.id, req.body.title, req.body.content);
        res.redirect(`/news/${req.params.id}`);
    }
);


// Удаление

app.post('/delete/:id', async (req, res) => {
    const deleted = await deleteNews(req.params.id);
    if (deleted) res.redirect('/?msg=deleted');
    else res.redirect('/?msg=delete_failed');
});


// 404

app.use((req, res) => {
    res.status(404).render('404');
});


app.listen(3000, () => console.log('Сервер работает на http://localhost:3000'));
