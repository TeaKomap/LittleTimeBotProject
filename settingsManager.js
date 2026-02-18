// utils/settingsManager.js
const fs = require('fs');
const path = require('path');

const SETTINGS_FILE = path.join(__dirname, '..', 'settings.json');

// Загрузка или создание файла
function loadSettings() {
  if (!fs.existsSync(SETTINGS_FILE)) {
    const defaultSettings = { groups: {} };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
    return defaultSettings;
  }
  const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
  return JSON.parse(data);
}

// Сохранение
function saveSettings(settings) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

// Получить настройки для чата
function getGroupSettings(chatId) {
  const settings = loadSettings();
  const id = String(chatId);
  if (!settings.groups[id]) {
    settings.groups[id] = {
      welcomeEnabled: true,
      welcomeMessage: '👋 Привет, {name}!\n\nРады видеть тебя в нашей группе! 😊'
    };
    saveSettings(settings);
  }
  return settings.groups[id];
}

// Обновить настройки
function updateGroupSettings(chatId, updates) {
  const settings = loadSettings();
  const id = String(chatId);
  settings.groups[id] = { ...settings.groups[id], ...updates };
  saveSettings(settings);
}

module.exports = {
  getGroupSettings,
  updateGroupSettings
};