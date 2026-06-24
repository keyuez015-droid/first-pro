const dateUtil = require('../../utils/date')
const storage = require('../../utils/storage')

Page({
  data: {
    statusBarHeight: 44,
    year: 2026,
    month: 6,
    monthEn: 'JUN',
    headerText: '26年6月',
    weekHeaders: dateUtil.WEEK_HEADERS,
    cells: [],
    diaries: {},
    settings: {}
  },

  onLoad() {
    const info = wx.getWindowInfo()
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    this.setData({ statusBarHeight: info.statusBarHeight || 44 })
    this.loadMonth(year, month)
  },

  onShow() {
    const settings = getApp().refreshSettings()
    this.setData({ settings })
    this.refreshDiaries()
  },

  loadMonth(year, month) {
    this.setData({
      year, month,
      monthEn: dateUtil.getMonthEn(month),
      headerText: dateUtil.formatHeaderYearMonth(year, month),
      cells: dateUtil.buildCalendarGrid(year, month)
    })
    this.refreshDiaries()
  },

  refreshDiaries() {
    const { year, month } = this.data
    const list = storage.getDiariesByMonth(year, month)
    const map = {}
    list.forEach(d => { map[d.date] = d })
    this.setData({ diaries: map })
  },

  onPrevMonth() {
    let { year, month } = this.data
    month--
    if (month < 1) { month = 12; year-- }
    this.loadMonth(year, month)
  },

  onNextMonth() {
    let { year, month } = this.data
    month++
    if (month > 12) { month = 1; year++ }
    this.loadMonth(year, month)
  },

  onSelectDay(e) {
    const { key, current } = e.currentTarget.dataset
    if (!current) return
    getApp().globalData.selectedDate = key
    wx.navigateTo({ url: `/pages/diary-edit/diary-edit?date=${key}` })
  },

  onNavRefresh() {
    this.refreshDiaries()
  }
})
