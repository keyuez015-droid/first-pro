/** 全局左上角返回 · 有上级 navigateBack，无上级 exitMiniProgram */
Component({
  properties: {
    /** 首页传 true，隐藏返回按钮 */
    isHome: { type: Boolean, value: false },
    /** dark=深色箭头（默认）；light=浅色箭头（深色彩页） */
    theme: { type: String, value: 'dark' },
    /** canvas 全屏页传 true，使用 cover-view 浮层 */
    nativeCover: { type: Boolean, value: false }
  },

  data: {
    statusBarHeight: 44,
    coverTop: 50,
    visible: true
  },

  lifetimes: {
    attached() {
      const info = wx.getWindowInfo()
      const statusBarHeight = info.statusBarHeight || 44
      this.setData({
        statusBarHeight,
        coverTop: statusBarHeight + 6,
        visible: !this.properties.isHome
      })
    }
  },

  observers: {
    isHome(val) {
      this.setData({ visible: !val })
    }
  },

  methods: {
    onBack() {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        wx.navigateBack({ delta: 1 })
      } else {
        wx.exitMiniProgram({
          fail: () => wx.reLaunch({ url: '/pages/calendar/calendar' })
        })
      }
    }
  }
})
