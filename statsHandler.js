// handlers/statsHandler.js
const {
  updateUserTextMessage,
  updateUserVoiceMessage,
  getChatStats
} = require('../utils/statsManager');

function setupStatsHandler(bot) {
  // Сбор текстовых сообщений
  bot.on('text', (ctx, next) => {
    if (ctx.chat.type === 'private') return next();
    const user = ctx.from;
    updateUserTextMessage(ctx.chat.id, user.id, getDisplayName(user));
    return next();
  });

  // Сбор голосовых сообщений
  bot.on('voice', (ctx, next) => {
    if (ctx.chat.type === 'private') return next();
    const user = ctx.from;
    const duration = ctx.message.voice.duration || 0;
    updateUserVoiceMessage(ctx.chat.id, user.id, getDisplayName(user), duration);
    return next();
  });

  // Команда /stats
  bot.command('stats', (ctx) => {
    if (ctx.chat.type === 'private') {
      return ctx.reply('Команда работает только в группах.');
    }

    const chatStats = getChatStats(ctx.chat.id);
    const users = Object.values(chatStats.users).sort((a, b) => {
      // Сортируем по общему "весу": 1 сообщение = 10 секунд голоса
      const scoreA = a.textCount + a.voiceSeconds / 10;
      const scoreB = b.textCount + b.voiceSeconds / 10;
      return scoreB - scoreA;
    });

    if (users.length === 0) {
      return ctx.reply('📊 Пока нет данных о активности.');
    }

    let text = '📊 Топ активности в чате:\n\n';
    users.slice(0, 10).forEach((user, i) => {
      const mins = (user.voiceSeconds / 60).toFixed(1);
      text += `${i + 1}. ${user.name}\n` +
              `   📝 Сообщений: ${user.textCount}\n` +
              `   🎙️ Голосовых: ${mins} мин\n\n`;
    });

    ctx.reply(text, { parse_mode: 'HTML' });
  });
}

function getDisplayName(user) {
  if (user.username) return `@${user.username}`;
  if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
  if (user.first_name) return user.first_name;
  return 'Пользователь';
}

module.exports = setupStatsHandler;