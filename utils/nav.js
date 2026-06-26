/** 页面返回 · 供 canvas 页 cover-view 使用 */
function goBack() {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    wx.navigateBack({ delta: 1 })
  } else {
    wx.exitMiniProgram({
      fail: () => wx.reLaunch({ url: '/pages/calendar/calendar' })
    })
  }
}

function getBackTop() {
  const info = wx.getWindowInfo()
  return (info.statusBarHeight || 44) + 6
}

module.exports = { goBack, getBackTop }
