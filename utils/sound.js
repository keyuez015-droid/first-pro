/** 轻柔音效 · 可全局关闭 */
const storage = require('./storage')

let innerAudio = null

function isEnabled() {
  return storage.getSettings().soundEnabled
}

function playTap() {
  if (!isEnabled()) return
  try {
    if (!innerAudio) {
      innerAudio = wx.createInnerAudioContext()
      innerAudio.volume = 0.3
    }
    innerAudio.src = ''
    innerAudio.play()
  } catch (e) { /* 静音降级 */ }
}

function vibrateLight() {
  if (!isEnabled()) return
  try { wx.vibrateShort({ type: 'light' }) } catch (e) { /* ignore */ }
}

module.exports = { isEnabled, playTap, vibrateLight }
