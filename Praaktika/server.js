// server.js
const express = require('express');
const app = express();
const path = require('path'); 




app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});



app.get('/teenused', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'teenused.html'));
});


app.get('/old-page', (req, res) => {
    res.redirect(301, '/'); 
});


app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}`);
});
