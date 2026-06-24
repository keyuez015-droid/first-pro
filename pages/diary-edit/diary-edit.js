const dateUtil = require('../../utils/date')
const storage = require('../../utils/storage')
const { MOODS } = require('../../utils/mood')

Page({
  data: {
    statusBarHeight: 44,
    dateKey: '',
    displayDate: '',
    text: '',
    mood: '',
    moods: MOODS,
    images: [],
    year: 2026,
    month: 6
  },

  onLoad(options) {
    const info = wx.getWindowInfo()
    const dateKey = options.date || dateUtil.getTodayKey()
    const parsed = dateUtil.parseDateKey(dateKey)
    const existing = storage.getDiary(dateKey)

    this.setData({
      statusBarHeight: info.statusBarHeight || 44,
      dateKey,
      displayDate: dateUtil.formatDisplay(dateKey),
      year: parsed.year,
      month: parsed.month,
      text: existing ? existing.text : '',
      mood: existing ? existing.mood : '',
      images: existing ? existing.images : []
    })
  },

  onShow() {
    const settings = getApp().refreshSettings()
    this.setData({ settings })
  },

  onInput(e) {
    this.setData({ text: e.detail.value })
  },

  onSelectMood(e) {
    this.setData({ mood: e.currentTarget.dataset.id })
  },

  onAddImage() {
    wx.chooseMedia({
      count: 3 - this.data.images.length,
      mediaType: ['image'],
      success: (res) => {
        const paths = res.tempFiles.map(f => f.tempFilePath)
        this.setData({ images: [...this.data.images, ...paths].slice(0, 3) })
      }
    })
  },

  onSubmit() {
    const { dateKey, text, mood, images } = this.data
    storage.saveDiary({ date: dateKey, text, mood, images })
    wx.showToast({ title: '好了~', icon: 'none', duration: 800 })
    setTimeout(() => {
      const { year, month } = this.data
      wx.redirectTo({ url: `/pages/notes/notes?year=${year}&month=${month}` })
    }, 600)
  },

  onBack() {
    wx.navigateBack()
  }
})
