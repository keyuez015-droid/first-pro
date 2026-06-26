Page({
  data: {
    statusBarHeight: 44,
    games: [
      { id: 'bubble', title: '正念按泡泡', desc: '专注按压，进入心流', path: '/pages/games/bubble/bubble', color: '#C4A8C8' },
      { id: 'cloud', title: '3D 捏云朵', desc: '揉捏蓬松，缓慢回弹', path: '/pages/games/cloud/cloud', color: '#E8E4DC' },
      { id: 'whitenoise', title: '白噪音聆听', desc: '细雨·森林·海浪', path: '/pages/games/whitenoise/whitenoise', color: '#A8BCC8' },
      { id: 'doodle', title: '随心涂鸦板', desc: '铅笔蜡笔，随意乱画', path: '/pages/games/doodle/doodle', color: '#F0D5A8' }
    ]
  },

  onLoad() {
    const info = wx.getWindowInfo()
    this.setData({ statusBarHeight: info.statusBarHeight || 44 })
  },

  onGame(e) {
    wx.navigateTo({ url: e.currentTarget.dataset.path })
  }
})
