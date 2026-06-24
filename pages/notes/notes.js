const dateUtil = require('../../utils/date')
const storage = require('../../utils/storage')
const { getMood } = require('../../utils/mood')

Page({
  data: {
    statusBarHeight: 44,
    year: 2026,
    month: 6,
    headerText: '',
    entries: [],
    filter: 'month'
  },

  onLoad(options) {
    const info = wx.getWindowInfo()
    const now = new Date()
    const year = Number(options.year) || now.getFullYear()
    const month = Number(options.month) || now.getMonth() + 1
    this.setData({
      statusBarHeight: info.statusBarHeight || 44,
      year, month,
      headerText: dateUtil.formatHeaderYearMonth(year, month)
    })
    this.loadEntries()
  },

  onShow() {
    this.loadEntries()
    const settings = getApp().refreshSettings()
    this.setData({ settings })
  },

  loadEntries() {
    const { year, month } = this.data
    const raw = storage.getDiariesByMonth(year, month)
    const entries = raw.map(e => ({
      ...e,
      shortDate: dateUtil.formatShort(e.date),
      moodInfo: getMood(e.mood)
    }))
    this.setData({ entries })
  },

  onBack() {
    wx.navigateBack({ fail: () => wx.reLaunch({ url: '/pages/calendar/calendar' }) })
  },

  onTapEntry(e) {
    const date = e.currentTarget.dataset.date
    wx.navigateTo({ url: `/pages/diary-edit/diary-edit?date=${date}` })
  },

  onNavRefresh() {
    this.loadEntries()
  }
})
