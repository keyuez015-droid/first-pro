const storage = require('./utils/storage')

App({
  globalData: {
    selectedDate: '',
    viewYear: 0,
    viewMonth: 0,
    settings: storage.getSettings()
  },

  onLaunch() {
    const settings = storage.getSettings()
    this.applySettings(settings)

    wx.onAppShow(() => {
      this.globalData.settings = storage.getSettings()
    })
  },

  applySettings(settings) {
    this.globalData.settings = settings
    const pages = getCurrentPages()
    const page = pages[pages.length - 1]
    if (page && page.setData) {
      page.setData({ settings })
    }
  },

  refreshSettings() {
    const settings = storage.getSettings()
    this.applySettings(settings)
    return settings
  }
})
