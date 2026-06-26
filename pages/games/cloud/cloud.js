/** 3D 捏云朵 · Canvas 软体形变 */
Page({
  data: { statusBarHeight: 44 },

  blobs: [],
  canvas: null,
  ctx: null,
  W: 0,
  H: 0,
  animId: null,
  touches: [],

  onLoad() {
    const info = wx.getWindowInfo()
    this.setData({ statusBarHeight: info.statusBarHeight || 44 })
  },

  onReady() { this.initCanvas() },

  onUnload() {
    if (this.animId && this.canvas) this.canvas.cancelAnimationFrame(this.animId)
  },

  initCanvas() {
    const query = wx.createSelectorQuery()
    query.select('#cloudCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res[0] || !res[0].node) return
      this.canvas = res[0].node
      this.ctx = this.canvas.getContext('2d')
      this.W = res[0].width
      this.H = res[0].height
      const dpr = wx.getWindowInfo().pixelRatio
      this.canvas.width = this.W * dpr
      this.canvas.height = this.H * dpr
      this.ctx.scale(dpr, dpr)

      const cx = this.W / 2
      const cy = this.H * 0.45
      for (let i = 0; i < 5; i++) {
        this.blobs.push({
          ox: cx + (Math.random() - 0.5) * 80,
          oy: cy + (Math.random() - 0.5) * 40,
          x: cx + (Math.random() - 0.5) * 80,
          y: cy + (Math.random() - 0.5) * 40,
          r: 50 + Math.random() * 40,
          squash: 0
        })
      }
      this.loop()
    })
  },

  loop() {
    const draw = () => {
      const { ctx, W, H, blobs } = this
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, '#EEF2F0')
      grad.addColorStop(1, '#D8E0DC')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      blobs.forEach(b => {
        b.x += (b.ox - b.x) * 0.03
        b.y += (b.oy - b.y) * 0.03
        b.squash *= 0.95
        const rx = b.r * (1 + b.squash * 0.3)
        const ry = b.r * (1 - b.squash * 0.2)

        ctx.beginPath()
        ctx.ellipse(b.x, b.y, rx, ry, 0, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,252,248,0.92)'
        ctx.shadowColor = 'rgba(74,69,64,0.08)'
        ctx.shadowBlur = 20
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.strokeStyle = 'rgba(196,168,130,0.2)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      })

      this.animId = this.canvas.requestAnimationFrame(draw)
    }
    draw()
  },

  onTouchMove(e) {
    e.touches.forEach(t => {
      this.blobs.forEach(b => {
        const dx = t.x - b.x
        const dy = t.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < b.r * 1.5) {
          b.x = t.x
          b.y = t.y
          b.squash = Math.min(1, b.squash + 0.15)
        }
      })
    })
  },

  onTouchEnd() {
    this.blobs.forEach(b => { b.squash = 0.5 })
  }
})
