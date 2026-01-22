const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');


    if (req.url === '/') {
        filePath = './views/index.html';
    } else if (req.url === '/services') {
        filePath = './views/services.html';
    } else if (req.url === '/teenused') {
        filePath = './views/teenused.html';
    } else {
        filePath = './views/404.html';
        res.statusCode = 404; // страница не найдена
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.statusCode = 500; // ошибка сервера
            res.end('Ошибка сервера');
        } else {
            res.end(data); // отправляем содержимое HTML
        }
    });
});

server.listen(3000, () => {
    console.log('Server töötab pordil 3000');
});
