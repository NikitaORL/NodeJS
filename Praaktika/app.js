const express = require('express');
const app = express();

// Указываем, что будем использовать EJS
app.set('view engine', 'ejs');

// Главная страница
app.get('/', (req, res) => {
    const news = [
        { title: "Открыт новый сайт", content: "Наш новый сайт теперь доступен пользователям." },
        { title: "Добавлена форма обратной связи", content: "На страницу контактов добавлена форма." },
        { title: "Используется Bootstrap 5", content: "Дизайн страницы удобен на мобильных устройствах." }
    ];
    res.render('index', { title: 'Главная', news });
});

// Страница услуг
app.get('/services', (req, res) => {
    res.render('services', { title: 'Услуги' });
});

// Перенаправление старой страницы
app.get('/old-page', (req, res) => {
    res.redirect('/');
});

// Обработка 404
app.use((req, res) => {
    res.status(404).render('404', { title: 'Страница не найдена' });
});

// Запуск сервера
app.listen(3000, () => {
    console.log('Server töötab pordil 3000');
});
