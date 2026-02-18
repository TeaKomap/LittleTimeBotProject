// bot.js
require('dotenv').config();
const { Telegraf } = require('telegraf');

if (!process.env.BOT_TOKEN) {
  throw new Error('❌ BOT_TOKEN не указан в .env файле');
}

const bot = new Telegraf(process.env.BOT_TOKEN);

// Опционально: логирование ошибок
bot.catch((err, ctx) => {
  console.error(`⚠️ Ошибка в обработчике:`, err);
});

// ЭКСПОРТИРУЕМ САМ ЭКЗЕМПЛЯР БОТА
module.exports = bot;