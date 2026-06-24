/** 日期工具 */
const WEEK_HEADERS = [
  { cn: '一', en: 'Mon' }, { cn: '二', en: 'Tue' }, { cn: '三', en: 'Wed' },
  { cn: '四', en: 'Thu' }, { cn: '五', en: 'Fri' }, { cn: '六', en: 'Sat' }, { cn: '日', en: 'Sun' }
]

const MONTH_EN = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

function pad(n) { return String(n).padStart(2, '0') }

function formatDateKey(y, m, d) {
  return `${y}-${pad(m)}-${pad(d)}`
}

function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return { year: y, month: m, day: d }
}

function getTodayKey() {
  const now = new Date()
  return formatDateKey(now.getFullYear(), now.getMonth() + 1, now.getDate())
}

function formatDisplay(key) {
  const { year, month, day } = parseDateKey(key)
  return `${year}/${pad(month)}/${pad(day)}`
}

function formatShort(key) {
  const { month, day } = parseDateKey(key)
  return `${month}/${day}`
}

function formatHeaderYearMonth(year, month) {
  const yy = String(year).slice(-2)
  return `${yy}年${month}月`
}

function getMonthEn(month) {
  return MONTH_EN[month - 1] || 'JAN'
}

/** 生成日历网格（含前后月填充） */
function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const daysInMonth = lastDay.getDate()
  let startWeekday = firstDay.getDay()
  startWeekday = startWeekday === 0 ? 6 : startWeekday - 1

  const cells = []
  const prevMonthLast = new Date(year, month - 1, 0).getDate()
  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = prevMonthLast - i
    const pm = month === 1 ? 12 : month - 1
    const py = month === 1 ? year - 1 : year
    cells.push({ day: d, month: pm, year: py, current: false, key: formatDateKey(py, pm, d) })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month, year, current: true, key: formatDateKey(year, month, d) })
  }
  const remain = 42 - cells.length
  const nm = month === 12 ? 1 : month + 1
  const ny = month === 12 ? year + 1 : year
  for (let d = 1; d <= remain; d++) {
    cells.push({ day: d, month: nm, year: ny, current: false, key: formatDateKey(ny, nm, d) })
  }
  return cells
}

function getRangeByFilter(filter, refDate) {
  const y = refDate.year
  const m = refDate.month
  if (filter === 'month') {
    const last = new Date(y, m, 0).getDate()
    return { start: formatDateKey(y, m, 1), end: formatDateKey(y, m, last) }
  }
  if (filter === 'quarter') {
    const startM = m - 2 < 1 ? 1 : m - 2
    return { start: formatDateKey(y, startM, 1), end: formatDateKey(y, m, new Date(y, m, 0).getDate()) }
  }
  return { start: formatDateKey(y, 1, 1), end: formatDateKey(y, 12, 31) }
}

module.exports = {
  WEEK_HEADERS, MONTH_EN,
  pad, formatDateKey, parseDateKey, getTodayKey,
  formatDisplay, formatShort, formatHeaderYearMonth, getMonthEn,
  buildCalendarGrid, getRangeByFilter
}
