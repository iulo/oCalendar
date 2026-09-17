import { Solar } from 'lunar-javascript'

export type CalendarDay = {
  date: Date
  key: string
  day: number
  inMonth: boolean
  isToday: boolean
  isWeekend: boolean
  weekNumber: number
  lunar: string
  festival: string
  solarTerm: string
}

const lunarFormatter = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
  month: 'long',
  day: 'numeric'
})
const lunarDayNames = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
]
const solarFestivals: Record<string, string> = {
  '01-01': '元旦', '02-14': '情人节', '03-08': '妇女节', '03-12': '植树节',
  '04-01': '愚人节', '05-01': '劳动节', '05-04': '青年节', '06-01': '儿童节',
  '07-01': '建党节', '08-01': '建军节', '09-10': '教师节', '10-01': '国庆节',
  '12-24': '平安夜', '12-25': '圣诞节'
}
const lunarFestivals: Record<string, string> = {
  '正月-1': '春节', '正月-15': '元宵节', '五月-5': '端午节',
  '七月-7': '七夕节', '七月-15': '中元节', '八月-15': '中秋节',
  '九月-9': '重阳节', '腊月-8': '腊八节', '腊月-23': '北小年', '腊月-24': '南小年'
}
const solarTermNames = [
  '小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
  '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑',
  '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
]
const solarTermCache = new Map<number, Map<string, string>>()

export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function getSolarTerms(year: number): Map<string, string> {
  const existing = solarTermCache.get(year)
  if (existing) return existing
  const result = new Map<string, string>()
  const table = Solar.fromYmd(year, 6, 1).getLunar().getJieQiTable()
  for (const name of solarTermNames) {
    const date = table[name]?.toYmd()
    if (date?.startsWith(`${year}-`)) result.set(date, name)
  }
  solarTermCache.set(year, result)
  return result
}

export function getLunar(date: Date): { label: string; festival: string } {
  const parts = lunarFormatter.formatToParts(date)
  const month = parts.find(part => part.type === 'month')?.value ?? ''
  const day = Number(parts.find(part => part.type === 'day')?.value ?? 0)
  const monthLabel = month === '十一月' ? '冬月' : month === '十二月' ? '腊月' : month
  const normalizedMonth = monthLabel === '一月' ? '正月' : monthLabel
  const label = day === 1 ? normalizedMonth : lunarDayNames[day - 1] ?? ''
  let festival = month.startsWith('闰') ? '' : lunarFestivals[`${normalizedMonth}-${day}`] ?? ''
  if (normalizedMonth === '腊月' && day >= 29) {
    const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    const nextParts = lunarFormatter.formatToParts(next)
    if (nextParts.find(part => part.type === 'month')?.value === '正月' &&
        nextParts.find(part => part.type === 'day')?.value === '1') festival = '除夕'
  }
  return { label, festival }
}

export function isoWeek(date: Date): number {
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  utc.setUTCDate(utc.getUTCDate() + 4 - (utc.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1))
  return Math.ceil((((utc.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

export function monthDays(year: number, month: number, weekStart: number, fixedRows: boolean): CalendarDay[] {
  const first = new Date(year, month, 1)
  const offset = (first.getDay() - weekStart + 7) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const count = fixedRows ? 42 : Math.ceil((offset + daysInMonth) / 7) * 7
  const today = dateKey(new Date())
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(year, month, index - offset + 1)
    const key = dateKey(date)
    const lunar = getLunar(date)
    const festival = solarFestivals[key.slice(5)] ?? lunar.festival
    return {
      date, key, day: date.getDate(), inMonth: date.getMonth() === month,
      isToday: key === today, isWeekend: date.getDay() === 0 || date.getDay() === 6,
      weekNumber: isoWeek(date), lunar: lunar.label, festival,
      solarTerm: getSolarTerms(date.getFullYear()).get(key) ?? ''
    }
  })
}
