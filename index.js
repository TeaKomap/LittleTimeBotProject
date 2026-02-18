
// index.js
const bot = require('./bot');
const setupWelcomeHandler = require('./handlers/welcome');
const setupAdminCommands = require('./handlers/adminCommands');
const setupStatsHandler = require('./handlers/statsHandler'); // ← новое

setupWelcomeHandler(bot);
setupAdminCommands(bot);
setupStatsHandler(bot); // ← подключаем

bot.launch();
console.log('✅ Бот запущен...');
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));