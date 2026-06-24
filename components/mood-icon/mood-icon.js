/** 手绘小动物 Canvas 绘制 */
const DRAWERS = {
  elephant: (ctx, s, c) => {
    ctx.setStrokeStyle('#4A4540'); ctx.setLineWidth(2.5); ctx.setLineCap('round')
    ctx.beginPath(); ctx.arc(s/2, s*0.45, s*0.28, 0, Math.PI*2); ctx.stroke()
    ctx.setFillStyle(c); ctx.fill()
    ctx.beginPath(); ctx.moveTo(s*0.25, s*0.5); ctx.quadraticCurveTo(s*0.1, s*0.7, s*0.2, s*0.75); ctx.stroke()
    ctx.beginPath(); ctx.arc(s*0.38, s*0.38, 3, 0, Math.PI*2); ctx.arc(s*0.58, s*0.38, 3, 0, Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.arc(s*0.48, s*0.52, s*0.06, 0, Math.PI); ctx.stroke()
  },
  cat: (ctx, s, c) => {
    ctx.setFillStyle(c); ctx.setStrokeStyle('#4A4540'); ctx.setLineWidth(2.5); ctx.setLineCap('round')
    ctx.beginPath(); ctx.arc(s/2, s*0.52, s*0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(s*0.3, s*0.3); ctx.lineTo(s*0.25, s*0.15); ctx.lineTo(s*0.38, s*0.28); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(s*0.7, s*0.3); ctx.lineTo(s*0.75, s*0.15); ctx.lineTo(s*0.62, s*0.28); ctx.stroke()
    ctx.setFillStyle('#4A4540'); ctx.beginPath(); ctx.arc(s*0.4, s*0.48, 3, 0, Math.PI*2); ctx.arc(s*0.6, s*0.48, 3, 0, Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.moveTo(s*0.45, s*0.58); ctx.lineTo(s*0.5, s*0.62); ctx.lineTo(s*0.55, s*0.58); ctx.stroke()
  },
  bird: (ctx, s, c) => {
    ctx.setFillStyle(c); ctx.setStrokeStyle('#4A4540'); ctx.setLineWidth(2.5)
    ctx.beginPath(); ctx.ellipse(s/2, s*0.5, s*0.25, s*0.22, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(s*0.72, s*0.45); ctx.lineTo(s*0.9, s*0.35); ctx.lineTo(s*0.85, s*0.5); ctx.closePath(); ctx.fill(); ctx.stroke()
    ctx.setFillStyle('#4A4540'); ctx.beginPath(); ctx.arc(s*0.58, s*0.45, 3, 0, Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.moveTo(s*0.35, s*0.55); ctx.quadraticCurveTo(s*0.2, s*0.65, s*0.3, s*0.7); ctx.stroke()
  },
  bear: (ctx, s, c) => {
    ctx.setFillStyle(c); ctx.setStrokeStyle('#4A4540'); ctx.setLineWidth(2.5)
    ctx.beginPath(); ctx.arc(s*0.32, s*0.28, s*0.1, 0, Math.PI*2); ctx.arc(s*0.68, s*0.28, s*0.1, 0, Math.PI*2); ctx.fill(); ctx.stroke()
    ctx.beginPath(); ctx.arc(s/2, s*0.52, s*0.28, 0, Math.PI*2); ctx.fill(); ctx.stroke()
    ctx.setFillStyle('#4A4540'); ctx.beginPath(); ctx.arc(s*0.42, s*0.48, 3, 0, Math.PI*2); ctx.arc(s*0.58, s*0.48, 3, 0, Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.moveTo(s*0.42, s*0.58); ctx.lineTo(s*0.5, s*0.52); ctx.lineTo(s*0.58, s*0.58); ctx.stroke()
  },
  dog: (ctx, s, c) => {
    ctx.setFillStyle(c); ctx.setStrokeStyle('#4A4540'); ctx.setLineWidth(2.5)
    ctx.beginPath(); ctx.ellipse(s/2, s*0.52, s*0.28, s*0.24, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke()
    ctx.beginPath(); ctx.ellipse(s*0.28, s*0.42, s*0.1, s*0.14, -0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke()
    ctx.beginPath(); ctx.ellipse(s*0.72, s*0.42, s*0.1, s*0.14, 0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke()
    ctx.setFillStyle('#4A4540'); ctx.beginPath(); ctx.arc(s*0.42, s*0.48, 3, 0, Math.PI*2); ctx.arc(s*0.58, s*0.48, 3, 0, Math.PI*2); ctx.fill()
  },
  bunny: (ctx, s, c) => {
    ctx.setFillStyle(c); ctx.setStrokeStyle('#4A4540'); ctx.setLineWidth(2.5)
    ctx.beginPath(); ctx.ellipse(s*0.38, s*0.22, s*0.08, s*0.2, -0.1, 0, Math.PI*2); ctx.ellipse(s*0.62, s*0.22, s*0.08, s*0.2, 0.1, 0, Math.PI*2); ctx.fill(); ctx.stroke()
    ctx.beginPath(); ctx.arc(s/2, s*0.55, s*0.26, 0, Math.PI*2); ctx.fill(); ctx.stroke()
    ctx.setFillStyle('#E8B4B8'); ctx.beginPath(); ctx.arc(s*0.42, s*0.58, s*0.05, 0, Math.PI*2); ctx.fill()
    ctx.setFillStyle('#4A4540'); ctx.beginPath(); ctx.arc(s*0.42, s*0.5, 2.5, 0, Math.PI*2); ctx.arc(s*0.58, s*0.5, 2.5, 0, Math.PI*2); ctx.fill()
  },
  fish: (ctx, s, c) => {
    ctx.setFillStyle(c); ctx.setStrokeStyle('#4A4540'); ctx.setLineWidth(2.5)
    ctx.beginPath(); ctx.ellipse(s*0.48, s*0.5, s*0.22, s*0.16, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(s*0.22, s*0.5); ctx.lineTo(s*0.08, s*0.35); ctx.lineTo(s*0.08, s*0.65); ctx.closePath(); ctx.fill(); ctx.stroke()
    ctx.setFillStyle('#4A4540'); ctx.beginPath(); ctx.arc(s*0.55, s*0.48, 2.5, 0, Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.arc(s*0.62, s*0.55, s*0.04, 0, Math.PI*2); ctx.stroke()
  },
  puppy: (ctx, s, c) => {
    ctx.setFillStyle(c); ctx.setStrokeStyle('#4A4540'); ctx.setLineWidth(2.5)
    ctx.beginPath(); ctx.arc(s/2, s*0.52, s*0.26, 0, Math.PI*2); ctx.fill(); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(s*0.3, s*0.35); ctx.quadraticCurveTo(s*0.2, s*0.5, s*0.32, s*0.55); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(s*0.7, s*0.35); ctx.quadraticCurveTo(s*0.8, s*0.5, s*0.68, s*0.55); ctx.stroke()
    ctx.setFillStyle('#4A4540'); ctx.beginPath(); ctx.arc(s*0.42, s*0.48, 3, 0, Math.PI*2); ctx.arc(s*0.58, s*0.48, 3, 0, Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.arc(s*0.5, s*0.62, s*0.06, Math.PI*0.2, Math.PI*0.8); ctx.stroke()
  }
}

Component({
  properties: {
    moodId: { type: String, value: '' },
    size: { type: Number, value: 80 },
    highlight: { type: Boolean, value: false }
  },

  observers: {
    'moodId, size, highlight'() { this.draw() }
  },

  lifetimes: {
    ready() { this.draw() }
  },

  methods: {
    draw() {
      const { moodId, size } = this.data
      if (!moodId) return
      const mood = require('../../utils/mood').getMood(moodId)
      if (!mood) return
      const drawer = DRAWERS[mood.animal]
      if (!drawer) return

      const query = this.createSelectorQuery()
      query.select('#moodCanvas').fields({ node: true, size: true }).exec((res) => {
        if (!res[0] || !res[0].node) return
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = wx.getWindowInfo().pixelRatio
        canvas.width = size * dpr
        canvas.height = size * dpr
        ctx.scale(dpr, dpr)
        ctx.clearRect(0, 0, size, size)
        drawer(ctx, size, mood.color)
      })
    }
  }
})
