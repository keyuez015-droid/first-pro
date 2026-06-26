/** 情绪缓解日记 · 项目结构说明
 *
 * pages/calendar      - 月度日历首页（启动页）
 * pages/diary-edit    - 单日心情日记编辑
 * pages/notes         - 月度日记汇总
 * pages/mood-stats    - 情绪统计（饼图/柱状/折线）
 * pages/games         - 解压游戏合集入口
 * pages/games/bubble  - 正念按泡泡
 * pages/games/cloud   - 3D 捏云朵
 * pages/games/whitenoise - 白噪音
 * pages/games/doodle  - 随心涂鸦
 *
 * components/back-btn     - 全局左上角返回（首页隐藏）
 * components/mood-icon   - Canvas 手绘小动物情绪图标
 *
 * utils/storage.js  - LocalStorage 日记/设置/涂鸦
 * utils/mood.js     - 8 类情绪配置 + MOODA 计分
 * utils/date.js     - 日历/日期工具
 * styles/variables.wxss - 全局设计令牌（配色/圆角/动画）
 *
 * 二次微调：修改 styles/variables.wxss 配色；
 * 情绪种类/计分见 utils/mood.js；
 * 手绘动物笔触见 components/mood-icon/mood-icon.js DRAWERS
 */
