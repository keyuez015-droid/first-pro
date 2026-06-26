/**
 * 3D 捏云朵 · 动效参数配置
 * 调整浮动速度、形变力度、旋转速率等在此修改即可
 */
module.exports = {
  /** 闲置自动动效 */
  idle: {
    rotateSpeedY: 0.004,
    rotateSpeedX: 0.001,
    floatAmplitude: 0.12,
    floatSpeed: 0.0015,
    floatPhase: 0
  },

  /** 交互形变 / 回弹 */
  interaction: {
    squashStrength: 0.28,
    squashFromDrag: 0.015,
    springStiffness: 0.14,
    springDamping: 0.82,
    maxSquash: 0.45
  },

  /** 进出场过渡 */
  transition: {
    enterDuration: 900,
    exitDuration: 450,
    enterScaleFrom: 0.15,
    enterEase: 0.08
  },

  /** 手势灵敏度 */
  gesture: {
    rotateSensitivity: 0.012,
    pinchScaleSensitivity: 0.018,
    panSensitivity: 0.012,
    minScale: 0.45,
    maxScale: 2.2,
    touchDeadZone: 2
  },

  /** 资源路径 */
  assets: {
    cloudTexture: '/pages/photo/图十.png'
  },

  /** 场景 */
  scene: {
    cameraZ: 4.2,
    fov: 42,
    bgColorTop: 0xeef2f0,
    bgColorBottom: 0xd8e0dc
  }
}
