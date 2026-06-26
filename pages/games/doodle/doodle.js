/** 随心涂鸦板 · 铅笔/蜡笔双笔触 */
const COLORS = ['#4A4540', '#C4A882', '#A8BCC8', '#E8C4C0', '#A8C4BC', '#E8C98A', '#B8A9C9', '#D4A5A5']

Page({
  data: {
    statusBarHeight: 44,
    colors: COLORS,
    activeColor: COLORS[0],
    brush: 'pencil',
    lineWidth: 3
  },

  canvas: null,
  ctx: null,
  W: 0,
  H: 0,
  drawing: false,
  lastX: 0,
  lastY: 0,

  onLoad() {
    const info = wx.getWindowInfo()
    this.setData({ statusBarHeight: info.statusBarHeight || 44 })
  },

  onReady() { this.initCanvas() },

  initCanvas() {
    const query = wx.createSelectorQuery()
    query.select('#doodleCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res[0] || !res[0].node) return
      this.canvas = res[0].node
      this.ctx = this.canvas.getContext('2d')
      this.W = res[0].width
      this.H = res[0].height
      const dpr = wx.getWindowInfo().pixelRatio
      this.canvas.width = this.W * dpr
      this.canvas.height = this.H * dpr
      this.ctx.scale(dpr, dpr)
      this.ctx.fillStyle = '#FDFAF5'
      this.ctx.fillRect(0, 0, this.W, this.H)
      this.drawPaperTexture()
    })
  },

  drawPaperTexture() {
    const { ctx, W, H } = this
    ctx.strokeStyle = 'rgba(196,168,130,0.08)'
    ctx.lineWidth = 1
    for (let y = 30; y < H; y += 30) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(W, y)
      ctx.stroke()
    }
  },

  onTouchStart(e) {
    const t = e.touches[0]
    this.drawing = true
    this.lastX = t.x
    this.lastY = t.y
  },

  onTouchMove(e) {
    if (!this.drawing) return
    const t = e.touches[0]
    const { ctx, brush, data } = this
    const lw = brush === 'crayon' ? data.lineWidth * 2.5 : data.lineWidth

    ctx.beginPath()
    ctx.moveTo(this.lastX, this.lastY)
    ctx.lineTo(t.x, t.y)
    ctx.strokeStyle = data.activeColor
    ctx.lineWidth = lw
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.globalAlpha = brush === 'crayon' ? 0.45 : 0.85
    ctx.stroke()
    ctx.globalAlpha = 1

    this.lastX = t.x
    this.lastY = t.y
  },

  onTouchEnd() { this.drawing = false },

  setColor(e) { this.setData({ activeColor: e.currentTarget.dataset.color }) },

  setBrush(e) {
    const brush = e.currentTarget.dataset.brush
    this.setData({ brush, lineWidth: brush === 'crayon' ? 5 : 3 })
  },

  onClear() {
    const { ctx, W, H } = this
    ctx.fillStyle = '#FDFAF5'
    ctx.fillRect(0, 0, W, H)
    this.drawPaperTexture()
  },

  onSave() {
    wx.canvasToTempFilePath({
      canvas: this.canvas,
      success: (res) => {
        const storage = require('../../../utils/storage')
        storage.saveDoodle(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => wx.showToast({ title: '已保存', icon: 'none' }),
          fail: () => wx.showToast({ title: '已存本地', icon: 'none' })
        })
      }
    })
  }
})
