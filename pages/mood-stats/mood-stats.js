const dateUtil = require('../../utils/date')
const storage = require('../../utils/storage')
const { MOODS, calcTotalScore, aggregateMoods, getTopMoods, getTrendData, BASE_SCORE } = require('../../utils/mood')

Page({
  data: {
    statusBarHeight: 44,
    year: 2026,
    month: 6,
    filter: 'month',
    filters: [
      { id: 'month', label: '单月' },
      { id: 'quarter', label: '三月' },
      { id: 'year', label: '全年' }
    ],
    totalScore: BASE_SCORE,
    records: [],
    topMoods: []
  },

  onLoad(options) {
    const info = wx.getWindowInfo()
    const now = new Date()
    this.setData({
      statusBarHeight: info.statusBarHeight || 44,
      year: Number(options.year) || now.getFullYear(),
      month: Number(options.month) || now.getMonth() + 1
    })
  },

  onReady() {
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const { year, month, filter } = this.data
    const range = dateUtil.getRangeByFilter(filter, { year, month })
    const records = storage.getDiariesByRange(range.start, range.end).filter(r => r.mood)
    const totalScore = calcTotalScore(records)
    const topMoods = getTopMoods(records, 10)

    this.setData({ records, totalScore, topMoods })
    this.drawPie(records)
    this.drawBar(topMoods)
    this.drawLine(records)
  },

  onFilter(e) {
    this.setData({ filter: e.currentTarget.dataset.id })
    this.loadData()
  },

  drawPie(records) {
    const query = wx.createSelectorQuery()
    query.select('#pieCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res[0] || !res[0].node) return
      const canvas = res[0].node
      const ctx = canvas.getContext('2d')
      const w = res[0].width
      const h = res[0].height
      const dpr = wx.getWindowInfo().pixelRatio
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, w, h)

      const counts = aggregateMoods(records)
      const total = Object.values(counts).reduce((a, b) => a + b, 0)
      if (total === 0) {
        ctx.fillStyle = '#8A8278'
        ctx.font = '14px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('暂无数据', w / 2, h / 2)
        return
      }

      const cx = w / 2
      const cy = h / 2
      const r = Math.min(w, h) * 0.35
      let start = -Math.PI / 2

      MOODS.forEach(m => {
        const val = counts[m.id]
        if (!val) return
        const slice = (val / total) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, r, start, start + slice)
        ctx.closePath()
        ctx.fillStyle = m.color
        ctx.fill()
        ctx.strokeStyle = '#FDFAF5'
        ctx.lineWidth = 2
        ctx.stroke()
        start += slice
      })

      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = '#FDFAF5'
      ctx.fill()
      ctx.fillStyle = '#4A4540'
      ctx.font = 'bold 18px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(this.data.totalScore, cx, cy + 6)
      ctx.font = '10px sans-serif'
      ctx.fillStyle = '#8A8278'
      ctx.fillText('MOOD', cx, cy - 12)
    })
  },

  drawBar(topMoods) {
    const query = wx.createSelectorQuery()
    query.select('#barCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res[0] || !res[0].node) return
      const canvas = res[0].node
      const ctx = canvas.getContext('2d')
      const w = res[0].width
      const h = res[0].height
      const dpr = wx.getWindowInfo().pixelRatio
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, w, h)

      if (!topMoods.length) return
      const maxCount = topMoods[0].count
      const barH = 28
      const gap = 12
      const labelW = 60

      topMoods.forEach((m, i) => {
        const y = 20 + i * (barH + gap)
        const barW = ((w - labelW - 40) * m.count) / maxCount
        ctx.fillStyle = m.color
        ctx.beginPath()
        ctx.moveTo(labelW + 8, y)
        ctx.lineTo(labelW + barW - 8, y)
        ctx.quadraticCurveTo(labelW + barW, y, labelW + barW, y + 8)
        ctx.lineTo(labelW + barW, y + barH - 8)
        ctx.quadraticCurveTo(labelW + barW, y + barH, labelW + barW - 8, y + barH)
        ctx.lineTo(labelW + 8, y + barH)
        ctx.quadraticCurveTo(labelW, y + barH, labelW, y + barH - 8)
        ctx.lineTo(labelW, y + 8)
        ctx.quadraticCurveTo(labelW, y, labelW + 8, y)
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = '#4A4540'
        ctx.font = '12px sans-serif'
        ctx.textAlign = 'right'
        ctx.fillText(m.label, labelW - 8, y + 18)
        ctx.textAlign = 'left'
        ctx.fillStyle = '#8A8278'
        ctx.fillText(String(m.count), labelW + barW + 8, y + 18)
      })
    })
  },

  drawLine(records) {
    const query = wx.createSelectorQuery()
    query.select('#lineCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res[0] || !res[0].node) return
      const canvas = res[0].node
      const ctx = canvas.getContext('2d')
      const w = res[0].width
      const h = res[0].height
      const dpr = wx.getWindowInfo().pixelRatio
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, w, h)

      const trend = getTrendData(records)
      if (trend.length < 2) return

      const pad = { l: 40, r: 20, t: 20, b: 30 }
      const chartW = w - pad.l - pad.r
      const chartH = h - pad.t - pad.b
      const maxVal = Math.max(...trend.map(t => Math.max(t.positive, t.negative)), 15)

      const drawLine = (key, color) => {
        ctx.beginPath()
        ctx.strokeStyle = color
        ctx.lineWidth = 2.5
        ctx.lineJoin = 'round'
        trend.forEach((t, i) => {
          const x = pad.l + (i / (trend.length - 1)) * chartW
          const y = pad.t + chartH - (t[key] / maxVal) * chartH
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        ctx.stroke()
      }

      drawLine('positive', '#A8C4BC')
      drawLine('negative', '#D4A5A5')

      ctx.strokeStyle = 'rgba(196,168,130,0.3)'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(pad.l, pad.t + chartH)
      ctx.lineTo(w - pad.r, pad.t + chartH)
      ctx.stroke()
      ctx.setLineDash([])
    })
  }
})
