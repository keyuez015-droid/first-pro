/**
 * 3D 捏云朵 · Canvas 2D 可复用组件
 * 使用图十原图 + 伪 3D 变换，无需 npm / three.js
 */
const ANIM = require('../../config/cloud-animation.js')

Component({
  properties: {},

  data: {
    loading: true,
    loadFailed: false
  },

  lifetimes: {
    ready() {
      setTimeout(() => this.init(), 60)
    },
    detached() {
      this.dispose()
    }
  },

  methods: {
    init() {
      const query = this.createSelectorQuery()
      query.select('#cloudCanvas').fields({ node: true, size: true }).exec(res => {
        try {
          if (!res || !res[0] || !res[0].node) {
            throw new Error('canvas not found')
          }
          const canvas = res[0].node
          const info = wx.getWindowInfo()
          const dpr = info.pixelRatio || 2
          const W = res[0].width || info.windowWidth
          const H = res[0].height || info.windowHeight

          canvas.width = W * dpr
          canvas.height = H * dpr
          const ctx = canvas.getContext('2d')
          ctx.scale(dpr, dpr)

          this.canvas = canvas
          this.ctx = ctx
          this.W = W
          this.H = H
          this.dpr = dpr

          this.state = {
            rotX: 0,
            rotY: 0,
            panX: 0,
            panY: 0,
            userScale: 1,
            squash: 0,
            squashTarget: 0,
            enterProgress: 0,
            exitProgress: 0,
            exiting: false,
            idleTime: 0,
            isInteracting: false,
            lastTouch: null,
            lastPinchDist: 0,
            globalAlpha: 0
          }

          this.cloudImg = null
          this.useFallback = false
          this.loadCloudImage(canvas)
          this.startLoop()
        } catch (err) {
          console.error('[cloud-scene]', err)
          this.useFallback = true
          this.setData({ loading: false, loadFailed: true })
        }
      })
    },

    loadCloudImage(canvas) {
      const img = canvas.createImage()
      img.onload = () => {
        this.cloudImg = img
        this.imgAspect = img.width / img.height
        this.setData({ loading: false })
        this.triggerEvent('ready')
      }
      img.onerror = () => {
        console.warn('[cloud-scene] 图十加载失败，使用默认云朵')
        this.useFallback = true
        this.setData({ loading: false, loadFailed: true })
        this.triggerEvent('ready')
      }
      img.src = ANIM.assets.cloudTexture
    },

    startLoop() {
      const tick = () => {
        if (!this.ctx) return
        this.update()
        this.draw()
        this.rafId = this.canvas.requestAnimationFrame(tick)
      }
      tick()
    },

    update() {
      const s = this.state
      if (!s) return

      if (s.exiting) {
        s.exitProgress = Math.min(1, s.exitProgress + 16 / ANIM.transition.exitDuration)
      } else if (s.enterProgress < 1) {
        s.enterProgress = Math.min(1, s.enterProgress + ANIM.transition.enterEase)
      }

      const enterT = this.easeOutBack(s.enterProgress)
      const exitT = s.exiting ? 1 - this.easeInQuad(s.exitProgress) : 1
      s.globalAlpha = enterT * exitT

      if (!s.isInteracting && !s.exiting) {
        s.idleTime += 1
        s.rotY += ANIM.idle.rotateSpeedY
        s.rotX = Math.sin(s.idleTime * ANIM.idle.floatSpeed * 60) * 0.08
        const floatY = Math.sin(s.idleTime * ANIM.idle.floatSpeed * 60) * ANIM.idle.floatAmplitude * 80
        s.panY += (floatY - s.panY) * 0.025
      }

      s.squash += (s.squashTarget - s.squash) * ANIM.interaction.springStiffness
      s.squashTarget *= ANIM.interaction.springDamping
      if (Math.abs(s.squashTarget) < 0.001) s.squashTarget = 0
    },

    draw() {
      const { ctx, W, H, state: s } = this
      if (!ctx || !s) return

      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, '#EEF2F0')
      grad.addColorStop(1, '#D8E0DC')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      const cx = W / 2 + s.panX
      const cy = H * 0.46 + s.panY
      const enterScale = ANIM.transition.enterScaleFrom + (1 - ANIM.transition.enterScaleFrom) * this.easeOutBack(s.enterProgress)
      const baseScale = s.userScale * enterScale * (s.exiting ? 1 - this.easeInQuad(s.exitProgress) : 1)
      const sq = s.squash * ANIM.interaction.squashStrength

      const cosY = Math.cos(s.rotY)
      const scaleX = baseScale * Math.max(0.25, Math.abs(cosY)) * (1 + sq)
      const scaleY = baseScale * (0.88 + 0.12 * Math.cos(s.rotX)) * (1 - sq * 0.55)
      const baseW = W * 0.78
      const baseH = baseW / (this.imgAspect || 1.4)

      ctx.save()
      ctx.globalAlpha = s.globalAlpha
      ctx.translate(cx, cy)

      if (this.useFallback || !this.cloudImg) {
        this.drawFallbackCloud(ctx, scaleX, scaleY, cosY)
      } else {
        this.drawTexturedCloud(ctx, scaleX, scaleY, cosY, baseW, baseH)
      }

      ctx.restore()
    },

    drawTexturedCloud(ctx, scaleX, scaleY, cosY, baseW, baseH) {
      const img = this.cloudImg
      const dir = cosY >= 0 ? 1 : -1

      ctx.save()
      ctx.scale(scaleX * 0.92, scaleY * 0.88)
      ctx.globalAlpha *= 0.2
      ctx.drawImage(img, -baseW / 2 + dir * 14, -baseH / 2 + 12, baseW, baseH)
      ctx.restore()

      ctx.save()
      ctx.scale(scaleX * dir, scaleY)
      ctx.globalAlpha *= 0.55 + 0.45 * Math.abs(cosY)
      ctx.drawImage(img, -baseW / 2, -baseH / 2, baseW, baseH)
      ctx.restore()

      if (Math.abs(cosY) < 0.85) {
        ctx.save()
        ctx.scale(scaleX * dir * 0.85, scaleY * 0.9)
        ctx.globalAlpha *= 0.35
        ctx.drawImage(img, -baseW / 2, -baseH / 2, baseW, baseH)
        ctx.restore()
      }
    },

    drawFallbackCloud(ctx, scaleX, scaleY, cosY) {
      const puffs = [
        [0, 0, 0.36], [-0.28, 0.02, 0.22], [0.3, 0, 0.24],
        [-0.12, -0.12, 0.18], [0.14, -0.1, 0.19], [0, 0.14, 0.16]
      ]
      const w = this.W * 0.78
      puffs.forEach(([px, py, pr]) => {
        ctx.beginPath()
        ctx.ellipse(
          px * w * scaleX * Math.max(0.3, Math.abs(cosY)),
          py * w * scaleY,
          pr * w * scaleX,
          pr * w * scaleY * 0.82,
          0, 0, Math.PI * 2
        )
        ctx.fillStyle = 'rgba(248,252,255,0.92)'
        ctx.shadowColor = 'rgba(168,188,200,0.2)'
        ctx.shadowBlur = 16
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.strokeStyle = 'rgba(200,220,230,0.3)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      })
    },

    easeOutBack(t) {
      const c1 = 1.70158
      const c3 = c1 + 1
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
    },

    easeInQuad(t) {
      return t * t
    },

    onTouchStart(e) {
      try {
        if (!this.state || !e.touches || !e.touches.length) return
        this.state.isInteracting = true
        this.state.lastTouch = this.copyTouches(e.touches)
        if (e.touches.length >= 2) {
          this.state.lastPinchDist = this.pinchDist(e.touches[0], e.touches[1])
        }
      } catch (err) {
        console.warn('[cloud-scene] touchStart', err)
      }
    },

    onTouchMove(e) {
      try {
        if (!this.state || !e.touches || !e.touches.length) return
        const cfg = ANIM.gesture
        const s = this.state
        const prev = s.lastTouch
        if (!prev) return

        if (e.touches.length === 1 && prev.length === 1) {
          const dx = e.touches[0].x - prev[0].x
          const dy = e.touches[0].y - prev[0].y
          if (Math.abs(dx) < cfg.touchDeadZone && Math.abs(dy) < cfg.touchDeadZone) return

          s.rotY += dx * cfg.rotateSensitivity
          s.rotX += dy * cfg.rotateSensitivity * 0.6
          s.panX += dx * cfg.panSensitivity
          s.panY += dy * cfg.panSensitivity
          s.squashTarget = Math.min(
            ANIM.interaction.maxSquash,
            s.squashTarget + (Math.abs(dx) + Math.abs(dy)) * ANIM.interaction.squashFromDrag
          )
        } else if (e.touches.length >= 2) {
          const dist = this.pinchDist(e.touches[0], e.touches[1])
          if (s.lastPinchDist > 0) {
            const ratio = dist / s.lastPinchDist
            s.userScale = Math.max(
              cfg.minScale,
              Math.min(cfg.maxScale, s.userScale * (1 + (ratio - 1) * cfg.pinchScaleSensitivity * 8))
            )
            s.squashTarget = Math.min(ANIM.interaction.maxSquash, s.squashTarget + Math.abs(ratio - 1) * 0.4)
          }
          s.lastPinchDist = dist

          if (prev.length >= 2) {
            const midX = (e.touches[0].x + e.touches[1].x) / 2
            const midY = (e.touches[0].y + e.touches[1].y) / 2
            const prevMidX = (prev[0].x + prev[1].x) / 2
            const prevMidY = (prev[0].y + prev[1].y) / 2
            s.panX += (midX - prevMidX) * cfg.panSensitivity
            s.panY += (midY - prevMidY) * cfg.panSensitivity
          }
        }
        s.lastTouch = this.copyTouches(e.touches)
      } catch (err) {
        console.warn('[cloud-scene] touchMove', err)
        if (this.state) this.state.lastTouch = null
      }
    },

    onTouchEnd(e) {
      try {
        const remain = (e.touches && e.touches.length) || 0
        if (!this.state) return
        if (remain === 0) {
          this.state.isInteracting = false
          this.state.lastTouch = null
          this.state.lastPinchDist = 0
          this.state.squashTarget = ANIM.interaction.maxSquash * 0.35
        } else if (remain === 1) {
          this.state.lastTouch = this.copyTouches(e.touches)
          this.state.lastPinchDist = 0
        }
      } catch (err) {
        console.warn('[cloud-scene] touchEnd', err)
      }
    },

    onTouchCancel(e) {
      this.onTouchEnd(e)
    },

    copyTouches(touches) {
      return touches.map(t => ({ x: t.x, y: t.y }))
    },

    pinchDist(a, b) {
      return Math.hypot(a.x - b.x, a.y - b.y)
    },

    fadeOut(callback) {
      if (!this.state) {
        callback && callback()
        return
      }
      this.state.exiting = true
      this.state.exitProgress = 0
      setTimeout(() => callback && callback(), ANIM.transition.exitDuration + 50)
    },

    dispose() {
      if (this.rafId && this.canvas) {
        this.canvas.cancelAnimationFrame(this.rafId)
      }
      this.rafId = null
      this.ctx = null
      this.canvas = null
      this.cloudImg = null
    }
  }
})
