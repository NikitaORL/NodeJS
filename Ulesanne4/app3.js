require('dotenv').config();
const express = require('express');
const { getNews, getNewsById } = require('./database');

const app = express();

app.set('view engine', 'ejs');

// Главная страница
app.get('/', async (req, res) => {
    const news = await getNews();
    res.render('index', {
        title: 'Avaleht',
        news
    });
});

// Отдельная новость
app.get('/news/:id', async (req, res) => {
    const id = req.params.id;
    const news = await getNewsById(id);
    res.render('news', {
        title: news.title,
        news
    });
});

// 404 страница
app.use((req, res) => {
    res.status(404).render('404', { title: 'Lehte ei leitud' });
});

// Запуск сервера
app.listen(3001);
