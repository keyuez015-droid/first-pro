/** 本地持久化 · 日记 / 设置 / 涂鸦 */
const DIARY_KEY = 'mood_diary_entries'
const SETTINGS_KEY = 'mood_diary_settings'
const DOODLE_KEY = 'mood_diary_doodles'

const DEFAULT_SETTINGS = {
  theme: 'kraft',
  fontSize: 'medium',
  soundEnabled: true,
  bgTone: 'warm'
}

function getSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...wx.getStorageSync(SETTINGS_KEY) }
  } catch (e) {
    return { ...DEFAULT_SETTINGS }
  }
}

function saveSettings(settings) {
  wx.setStorageSync(SETTINGS_KEY, { ...getSettings(), ...settings })
}

function getAllDiaries() {
  try {
    return wx.getStorageSync(DIARY_KEY) || {}
  } catch (e) {
    return {}
  }
}

function getDiary(dateKey) {
  return getAllDiaries()[dateKey] || null
}

function saveDiary(entry) {
  const all = getAllDiaries()
  all[entry.date] = {
    date: entry.date,
    text: entry.text || '',
    mood: entry.mood || '',
    images: entry.images || [],
    updatedAt: Date.now()
  }
  wx.setStorageSync(DIARY_KEY, all)
  return all[entry.date]
}

function deleteDiary(dateKey) {
  const all = getAllDiaries()
  delete all[dateKey]
  wx.setStorageSync(DIARY_KEY, all)
}

function getDiariesByMonth(year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`
  const all = getAllDiaries()
  return Object.keys(all)
    .filter(k => k.startsWith(prefix))
    .sort((a, b) => b.localeCompare(a))
    .map(k => all[k])
}

function getDiariesByRange(startDate, endDate) {
  const all = getAllDiaries()
  return Object.keys(all)
    .filter(k => k >= startDate && k <= endDate)
    .sort()
    .map(k => all[k])
}

function clearAllData() {
  wx.removeStorageSync(DIARY_KEY)
  wx.removeStorageSync(DOODLE_KEY)
}

function exportData() {
  return JSON.stringify({
    diaries: getAllDiaries(),
    settings: getSettings(),
    doodles: wx.getStorageSync(DOODLE_KEY) || [],
    exportedAt: new Date().toISOString()
  })
}

function saveDoodle(dataUrl) {
  const list = wx.getStorageSync(DOODLE_KEY) || []
  list.unshift({ id: Date.now(), data: dataUrl, createdAt: Date.now() })
  wx.setStorageSync(DOODLE_KEY, list.slice(0, 20))
}

function getDoodles() {
  return wx.getStorageSync(DOODLE_KEY) || []
}

module.exports = {
  DEFAULT_SETTINGS,
  getSettings, saveSettings,
  getAllDiaries, getDiary, saveDiary, deleteDiary,
  getDiariesByMonth, getDiariesByRange,
  clearAllData, exportData,
  saveDoodle, getDoodles
}
