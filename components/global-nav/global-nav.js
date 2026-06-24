Component({
  properties: {
    year: { type: Number, value: 2026 },
    month: { type: Number, value: 6 }
  },

  data: {
    showSettings: false,
    settings: {},
    themes: [
      { id: 'warm', label: '暖杏' },
      { id: 'cool', label: '雾霾' }
    ],
    fontSizes: [
      { id: 'small', label: '小' },
      { id: 'medium', label: '中' },
      { id: 'large', label: '大' }
    ]
  },

  lifetimes: {
    attached() {
      const storage = require('../../utils/storage')
      this.setData({ settings: storage.getSettings() })
    }
  },

  methods: {
    onSettings() {
      const storage = require('../../utils/storage')
      this.setData({ showSettings: true, settings: storage.getSettings() })
    },

    onNotes() {
      wx.navigateTo({
        url: `/pages/notes/notes?year=${this.data.year}&month=${this.data.month}`
      })
    },

    onStats() {
      wx.navigateTo({
        url: `/pages/mood-stats/mood-stats?year=${this.data.year}&month=${this.data.month}`
      })
    },

    onGames() {
      wx.navigateTo({ url: '/pages/games/games' })
    },

    closeSettings() {
      this.setData({ showSettings: false })
    },

    toggleSound(e) {
      const storage = require('../../utils/storage')
      const soundEnabled = e.detail.value
      storage.saveSettings({ soundEnabled })
      this.setData({ 'settings.soundEnabled': soundEnabled })
      getApp().refreshSettings()
    },

    setTheme(e) {
      const bgTone = e.currentTarget.dataset.id
      const storage = require('../../utils/storage')
      storage.saveSettings({ bgTone, theme: bgTone === 'cool' ? 'cool' : 'kraft' })
      this.setData({ 'settings.bgTone': bgTone, 'settings.theme': bgTone === 'cool' ? 'cool' : 'kraft' })
      getApp().refreshSettings()
    },

    setFontSize(e) {
      const fontSize = e.currentTarget.dataset.id
      const storage = require('../../utils/storage')
      storage.saveSettings({ fontSize })
      this.setData({ 'settings.fontSize': fontSize })
      getApp().refreshSettings()
    },

    clearData() {
      wx.showModal({
        title: '清空本地数据',
        content: '所有日记与情绪记录将被删除，建议先导出备份。确定继续？',
        confirmColor: '#8B7355',
        success: (res) => {
          if (res.confirm) {
            const storage = require('../../utils/storage')
            storage.clearAllData()
            wx.showToast({ title: '已清空', icon: 'none' })
            this.closeSettings()
            this.triggerEvent('refresh')
          }
        }
      })
    },

    exportData() {
      const storage = require('../../utils/storage')
      const data = storage.exportData()
      wx.setClipboardData({
        data,
        success: () => wx.showToast({ title: '已复制到剪贴板', icon: 'none' })
      })
    },

    noop() {}
  }
})
