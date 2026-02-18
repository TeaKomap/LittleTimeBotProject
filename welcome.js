// handlers/welcome.js
const { getGroupSettings } = require('../utils/settingsManager');

function setupWelcomeHandler(bot) {
  bot.on('message', async (ctx, next) => {
    const message = ctx.message;

    if (message?.new_chat_members?.length > 0) {
      // Определяем ID группы
      const chatId = message.chat.id;

      // Получаем настройки
      const settings = getGroupSettings(chatId);

      if (!settings.welcomeEnabled) {
        return next();
      }

      for (const member of message.new_chat_members) {
        if (member.id === ctx.botInfo.id) continue; // пропускаем самого бота

        let userName = member.username 
          ? `@${member.username}`
          : member.first_name || 'Друг';

        // Подставляем имя в шаблон
        let text = settings.welcomeMessage.replace(/{name}/g, userName);

        try {
          await ctx.reply(text, {
            reply_parameters: { message_id: message.message_id },
            parse_mode: 'HTML'
          });
          console.log(`✅ Приветствие отправлено: ${userName} в чат ${chatId}`);
        } catch (err) {
          console.error(`❌ Ошибка при отправке приветствия:`, err.message);
        }
      }
    }

    return next();
  });
}

module.exports = setupWelcomeHandler;