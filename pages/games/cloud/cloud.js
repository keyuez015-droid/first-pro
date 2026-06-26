/** 3D 捏云朵 · 页面壳层 */
const { goBack, getBackTop } = require('../../../utils/nav')

Page({
  data: {
    statusBarHeight: 44,
    backTop: 50
  },

  onLoad() {
    const info = wx.getWindowInfo()
    this.setData({
      statusBarHeight: info.statusBarHeight || 44,
      backTop: getBackTop()
    })
  },

  onBack() {
    const scene = this.selectComponent('#cloudScene')
    if (scene && scene.fadeOut) {
      scene.fadeOut(() => goBack())
    } else {
      goBack()
    }
  }
})
