const fs = require("fs");
const { names, roles } = require("./data.js");

console.log("Names:", names);
console.log("Roles:", roles);

// Создаём папку assets, если её нет
if (!fs.existsSync("./assets")) {
    fs.mkdirSync("./assets");
}

// Записываем roles в файл, каждый элемент на новой строке
fs.writeFile("./assets/text.txt", roles.join("\n"), (err) => {
    if (err) {
        console.error("Ошибка при записи файла:", err);
        return;
    }
    console.log("Массив roles записан в файл ./assets/text.txt");

    // Читаем файл повторно
    fs.readFile("./assets/text.txt", "utf8", (err, data) => {
        if (err) {
            console.error("Ошибка при чтении файла:", err);
            return;
        }
        console.log("Содержимое файла ./assets/text.txt:");
        console.log(data);
    });
});
