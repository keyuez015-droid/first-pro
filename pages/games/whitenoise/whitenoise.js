/** 白噪音聆听专区 */
const SOUNDS = [
  { id: 'rain', label: '细雨', emoji: '🌧' },
  { id: 'forest', label: '森林鸟鸣', emoji: '🌲' },
  { id: 'ocean', label: '海洋海浪', emoji: '🌊' },
  { id: 'fire', label: '篝火噼啪', emoji: '🔥' },
  { id: 'wind', label: '林间微风', emoji: '🍃' }
]

Page({
  data: {
    statusBarHeight: 44,
    sounds: SOUNDS,
    activeId: '',
    playing: false,
    volume: 0.6
  },

  audio: null,

  onLoad() {
    const info = wx.getWindowInfo()
    this.setData({ statusBarHeight: info.statusBarHeight || 44 })
    this.audio = wx.createInnerAudioContext()
    this.audio.loop = true
    this.audio.volume = 0.6
  },

  onUnload() {
    if (this.audio) {
      this.audio.stop()
      this.audio.destroy()
    }
  },

  onSelect(e) {
    const id = e.currentTarget.dataset.id
    const storage = require('../../../utils/storage')
    if (!storage.getSettings().soundEnabled) {
      wx.showToast({ title: '请在设置中开启音效', icon: 'none' })
      return
    }

    if (this.data.activeId === id && this.data.playing) {
      this.audio.pause()
      this.setData({ playing: false })
      return
    }

    this.setData({ activeId: id, playing: true })
    this.audio.src = ''
    this.audio.play()
    wx.showToast({ title: `播放 ${SOUNDS.find(s => s.id === id).label}`, icon: 'none', duration: 1000 })
  },

  onVolume(e) {
    const volume = e.detail.value / 100
    this.audio.volume = volume
    this.setData({ volume })
  },

  onStop() {
    this.audio.stop()
    this.setData({ playing: false, activeId: '' })
  }
})
