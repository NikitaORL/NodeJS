const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Настройка EJS
app.set('view engine', 'ejs');

// Статические файлы (если будут свои CSS или картинки)
app.use(express.static('public'));

// Чтение данных о животных из JSON
function getAnimals() {
    const data = fs.readFileSync(path.join(__dirname, 'loomi.json'));
    return JSON.parse(data);
}

// Главная страница - последние 4 животных
app.get('/', (req, res) => {
    const animals = getAnimals();
    const latestAnimals = animals.slice(-4).reverse(); // последние 4
    res.render('Esileht', { title: 'Главная', animals: latestAnimals });
});

// Страница "Животные" - все животные
app.get('/animals', (req, res) => {
    const animals = getAnimals();
    res.render('loomad', { title: 'Животные', animals });
});

// Страница "О нас"
app.get('/about', (req, res) => {
    res.render('meiest', { title: 'О нас' });
});

// Страница "Контакт"
app.get('/contact', (req, res) => {
    res.render('kontakt', { title: 'Контакт' });
});

// 404 страница
app.use((req, res) => {
    res.status(404).render('404', { title: 'Страница не найдена' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
