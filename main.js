const { program } = require('commander');
const fs = require('fs');

// Налаштування параметрів командного рядка
program
  .requiredOption('-i, --input <path>', 'шлях до файлу з даними') // Обов'язковий [cite: 124, 129]
  .option('-o, --output <path>', 'шлях до файлу для результату') // [cite: 127]
  .option('-d, --display', 'вивести результат у консоль') // [cite: 128]
  .option('-m, --mfo', 'показати МФО перед назвою') // Варіант 1 [cite: 143]
  .option('-n, --normal', 'тільки працюючі банки (код 1)'); // Варіант 1 [cite: 144]

program.parse(process.argv);
const options = program.opts();

// 1. Перевірка наявності файлу [cite: 130]
if (!fs.existsSync(options.input)) {
    console.error("Cannot find input file");
    process.exit(1);
}

// 2. Читання та парсинг даних [cite: 136]
const rawData = fs.readFileSync(options.input, 'utf8');
let data = JSON.parse(rawData);

// 3. Логіка фільтрації (Варіант 1: Тільки "Нормальні") [cite: 144]
if (options.normal) {
    data = data.filter(bank => bank.COD_STATE === 1);
}

// 4. Форматування виводу [cite: 143, 145]
const result = data.map(bank => {
    const prefix = options.mfo ? `${bank.MFO} ` : "";
    return `${prefix}${bank.SHORTNAME}`;
}).join('\n');

// 5. Вивід результату [cite: 132]
if (options.display) {
    console.log(result);
}

if (options.output) {
    fs.writeFileSync(options.output, result, 'utf8'); // [cite: 133]
}