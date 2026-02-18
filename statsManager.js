// utils/statsManager.js
const fs = require('fs');
const path = require('path');

const STATS_FILE = path.join(__dirname, '..', 'stats.json');

function loadStats() {
  if (!fs.existsSync(STATS_FILE)) {
    const defaultStats = { chats: {} };
    fs.writeFileSync(STATS_FILE, JSON.stringify(defaultStats, null, 2));
    return defaultStats;
  }
  try {
    const data = fs.readFileSync(STATS_FILE, 'utf8').trim();
    return data ? JSON.parse(data) : { chats: {} };
  } catch (err) {
    console.error('⚠️ Ошибка чтения stats.json, создаём новый');
    const defaultStats = { chats: {} };
    fs.writeFileSync(STATS_FILE, JSON.stringify(defaultStats, null, 2));
    return defaultStats;
  }
}

function saveStats(stats) {
  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
}

function getChatStats(chatId) {
  const stats = loadStats();
  const id = String(chatId);
  if (!stats.chats[id]) {
    stats.chats[id] = { users: {} };
    saveStats(stats);
  }
  return stats.chats[id];
}

function updateUserTextMessage(chatId, userId, userName) {
  const stats = loadStats();
  const id = String(chatId);
  const uid = String(userId);

  if (!stats.chats[id]) stats.chats[id] = { users: {} };
  if (!stats.chats[id].users[uid]) {
    stats.chats[id].users[uid] = { name: userName, textCount: 0, voiceSeconds: 0 };
  }

  stats.chats[id].users[uid].name = userName;
  stats.chats[id].users[uid].textCount += 1;

  saveStats(stats);
}

function updateUserVoiceMessage(chatId, userId, userName, durationSeconds) {
  const stats = loadStats();
  const id = String(chatId);
  const uid = String(userId);

  if (!stats.chats[id]) stats.chats[id] = { users: {} };
  if (!stats.chats[id].users[uid]) {
    stats.chats[id].users[uid] = { name: userName, textCount: 0, voiceSeconds: 0 };
  }

  stats.chats[id].users[uid].name = userName;
  stats.chats[id].users[uid].voiceSeconds += durationSeconds;

  saveStats(stats);
}

module.exports = {
  getChatStats,
  updateUserTextMessage,
  updateUserVoiceMessage
};