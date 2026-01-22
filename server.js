const http = require('http');

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);
  res.write('<h1>Tervitused serverist</h1>');
  res.write('<p>See tekst tuli Node.js serverist</p>');
  res.end();
});

server.listen(3000, () => {
    console.log('Server töötab pordil 3000');
});