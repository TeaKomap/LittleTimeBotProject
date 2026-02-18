// handlers/adminCommands.js
const { updateGroupSettings, getGroupSettings } = require('../utils/settingsManager');

// Проверка, является ли пользователь админом в текущем чате
async function isAdminInCurrentChat(ctx) {
  const chatId = ctx.chat.id;
  const userId = ctx.from.id;

  // В личке нет админов → разрешаем только в группах
  if (ctx.chat.type === 'private') {
    return false;
  }

  try {
    const admins = await ctx.getChatAdministrators();
    return admins.some(admin => admin.user.id === userId);
  } catch (err) {
    console.error('Не удалось получить список админов:', err.message);
    return false;
  }
}

function setupAdminCommands(bot) {
  // /welcome on | off — работает ТОЛЬКО в группе
  bot.command('welcome', async (ctx) => {
    if (ctx.chat.type === 'private') {
      return ctx.reply('Эту команду нужно использовать в группе.');
    }

    const args = ctx.message.text.split(/\s+/);
    const action = args[1]?.toLowerCase();

    if (!['on', 'off'].includes(action)) {
      return ctx.reply('Использование:\n/welcome on\n/welcome off');
    }

    const isAdmin = await isAdminInCurrentChat(ctx);
    if (!isAdmin) {
      return ctx.reply('⛔ Только администраторы могут управлять приветствием.');
    }

    const chatId = ctx.chat.id;
    const enabled = action === 'on';

    updateGroupSettings(chatId, { welcomeEnabled: enabled });
    ctx.reply(`✅ Приветствие ${enabled ? 'включено' : 'выключено'}.`);
  });

  // /setwelcome <текст> — работает ТОЛЬКО в группе
  bot.command('setwelcome', async (ctx) => {
    if (ctx.chat.type === 'private') {
      return ctx.reply('Эту команду нужно использовать в группе.');
    }

    const isAdmin = await isAdminInCurrentChat(ctx);
    if (!isAdmin) {
      return ctx.reply('⛔ Только администраторы могут менять текст приветствия.');
    }

    // Извлекаем текст после команды
    const fullText = ctx.message.text;
    const commandLength = '/setwelcome'.length;
    const newMessage = fullText.substring(commandLength).trim();

    if (!newMessage) {
      return ctx.reply('Укажите текст приветствия.\nПример:\n/setwelcome Привет, {name}! Добро пожаловать!');
    }

    const chatId = ctx.chat.id;
    updateGroupSettings(chatId, { welcomeMessage: newMessage });
    ctx.reply('✅ Текст приветствия обновлён!');
  });
}

module.exports = setupAdminCommands;