/** 正念按泡泡 · 6 类泡泡 + 完美按压判定 */
const BUBBLE_TYPES = [
  { id: 'normal', color: 'rgba(232,196,192,0.55)', score: 5, min: 500, max: 1500 },
  { id: 'gold', color: 'rgba(232,201,138,0.65)', score: 15, min: 500, max: 1500 },
  { id: 'chain', color: 'rgba(184,169,201,0.55)', score: 8, min: 500, max: 1500 },
  { id: 'slow', color: 'rgba(168,188,200,0.55)', score: 10, min: 800, max: 2000 },
  { id: 'rainbow', color: 'rgba(240,213,168,0.6)', score: 12, min: 500, max: 1500 },
  { id: 'giant', color: 'rgba(196,168,130,0.5)', score: 20, min: 1000, max: 2500 }
]

const ENCOURAGE = ['心流爆炸 ✨', '完美！', '好专注~', '慢慢来', '你很棒', '呼吸...']

Page({
  data: {
    statusBarHeight: 44,
    score: 0,
    perfectStreak: 0,
    feedback: '',
    feedbackX: 0,
    feedbackY: 0,
    showFeedback: false,
    encourage: ''
  },

  bubbles: [],
  canvas: null,
  ctx: null,
  W: 0,
  H: 0,
  animId: null,
  pressStart: 0,
  activeBubble: null,

  onLoad() {
    const info = wx.getWindowInfo()
    this.setData({ statusBarHeight: info.statusBarHeight || 44 })
  },

  onReady() {
    this.initCanvas()
  },

  onUnload() {
    if (this.animId) this.canvas.cancelAnimationFrame(this.animId)
  },

  initCanvas() {
    const query = wx.createSelectorQuery()
    query.select('#bubbleCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res[0] || !res[0].node) return
      this.canvas = res[0].node
      this.ctx = this.canvas.getContext('2d')
      this.W = res[0].width
      this.H = res[0].height
      const dpr = wx.getWindowInfo().pixelRatio
      this.canvas.width = this.W * dpr
      this.canvas.height = this.H * dpr
      this.ctx.scale(dpr, dpr)
      this.spawnBubbles(12)
      this.loop()
    })
  },

  spawnBubbles(n) {
    for (let i = 0; i < n; i++) {
      const type = BUBBLE_TYPES[Math.floor(Math.random() * BUBBLE_TYPES.length)]
      this.bubbles.push({
        x: 40 + Math.random() * (this.W - 80),
        y: 40 + Math.random() * (this.H - 80),
        r: 20 + Math.random() * 30,
        type,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: 1,
        popping: false
      })
    }
  },

  loop() {
    const draw = () => {
      const { ctx, W, H, bubbles } = this
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, '#9A8898')
      grad.addColorStop(1, '#B86B61')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      bubbles.forEach(b => {
        if (!b.popping) {
          b.x += b.vx
          b.y += b.vy
          if (b.x - b.r < 0 || b.x + b.r > W) b.vx *= -1
          if (b.y - b.r < 0 || b.y + b.r > H) b.vy *= -1
        }
        ctx.globalAlpha = b.alpha
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fillStyle = b.type.color
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.15, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.fill()
        ctx.globalAlpha = 1
      })

      this.animId = this.canvas.requestAnimationFrame(draw)
    }
    draw()
  },

  onTouchStart(e) {
    const touch = e.touches[0]
    const x = touch.x
    const y = touch.y
    this.pressStart = Date.now()
    this.activeBubble = this.bubbles.find(b => {
      const dx = b.x - x
      const dy = b.y - y
      return Math.sqrt(dx * dx + dy * dy) < b.r && !b.popping
    })
  },

  onTouchEnd(e) {
    if (!this.activeBubble) return
    const duration = Date.now() - this.pressStart
    const b = this.activeBubble
    const { min, max, score } = b.type
    const perfect = duration >= min && duration <= max

    let pts = perfect ? score : 0
    let streak = this.data.perfectStreak

    if (perfect) {
      streak++
      if (streak >= 5) {
        this.setData({ encourage: ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)] })
        streak = 0
        setTimeout(() => this.setData({ encourage: '' }), 2000)
      }
    } else {
      streak = 0
    }

    b.popping = true
    const fade = () => {
      b.alpha -= 0.08
      if (b.alpha <= 0) {
        const idx = this.bubbles.indexOf(b)
        if (idx > -1) this.bubbles.splice(idx, 1)
        const type = BUBBLE_TYPES[Math.floor(Math.random() * BUBBLE_TYPES.length)]
        this.bubbles.push({
          x: 40 + Math.random() * (this.W - 80),
          y: 40 + Math.random() * (this.H - 80),
          r: 20 + Math.random() * 30,
          type, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
          alpha: 1, popping: false
        })
        if (b.type.id === 'chain') {
          this.bubbles.push({
            x: b.x + 30, y: b.y, r: b.r * 0.7,
            type: BUBBLE_TYPES[0], vx: 0.2, vy: -0.2, alpha: 1, popping: false
          })
        }
      } else {
        setTimeout(fade, 30)
      }
    }
    fade()

    this.setData({
      score: this.data.score + pts,
      perfectStreak: streak,
      feedback: perfect ? `+${pts}` : '…',
      feedbackX: b.x,
      feedbackY: b.y - b.r - 10,
      showFeedback: true
    })
    setTimeout(() => this.setData({ showFeedback: false }), 800)
    this.activeBubble = null
  }
})
