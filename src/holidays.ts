export type HolidayType = 'holiday' | 'workday'

type HolidayRange = { name: string; start: string; end: string; workdays?: string[] }

// 数据来源：https://github.com/lanceliao/china-holiday-calender
const ranges: HolidayRange[] = [
  { name: '元旦', start: '2023-01-01', end: '2023-01-02' },
  { name: '春节', start: '2023-01-21', end: '2023-01-27', workdays: ['2023-01-28', '2023-01-29'] },
  { name: '清明节', start: '2023-04-05', end: '2023-04-05' },
  { name: '劳动节', start: '2023-04-29', end: '2023-05-03', workdays: ['2023-04-23', '2023-05-06'] },
  { name: '端午节', start: '2023-06-22', end: '2023-06-24', workdays: ['2023-06-25'] },
  { name: '中秋节、国庆节', start: '2023-09-29', end: '2023-10-06', workdays: ['2023-10-07', '2023-10-08'] },
  { name: '元旦', start: '2024-01-01', end: '2024-01-01' },
  { name: '春节', start: '2024-02-10', end: '2024-02-17', workdays: ['2024-02-04', '2024-02-18'] },
  { name: '清明节', start: '2024-04-04', end: '2024-04-06', workdays: ['2024-04-07'] },
  { name: '劳动节', start: '2024-05-01', end: '2024-05-05', workdays: ['2024-04-28', '2024-05-11'] },
  { name: '端午节', start: '2024-06-10', end: '2024-06-10' },
  { name: '中秋节', start: '2024-09-15', end: '2024-09-17', workdays: ['2024-09-14'] },
  { name: '国庆节', start: '2024-10-01', end: '2024-10-07', workdays: ['2024-09-29', '2024-10-12'] },
  { name: '元旦', start: '2025-01-01', end: '2025-01-01' },
  { name: '春节', start: '2025-01-28', end: '2025-02-04', workdays: ['2025-01-26', '2025-02-08'] },
  { name: '清明节', start: '2025-04-04', end: '2025-04-06' },
  { name: '劳动节', start: '2025-05-01', end: '2025-05-05', workdays: ['2025-04-27'] },
  { name: '端午节', start: '2025-05-31', end: '2025-06-02' },
  { name: '中秋节、国庆节', start: '2025-10-01', end: '2025-10-08', workdays: ['2025-09-28', '2025-10-11'] },
  { name: '元旦', start: '2026-01-01', end: '2026-01-03', workdays: ['2026-01-04'] },
  { name: '春节', start: '2026-02-15', end: '2026-02-23', workdays: ['2026-02-14', '2026-02-28'] },
  { name: '清明节', start: '2026-04-04', end: '2026-04-06' },
  { name: '劳动节', start: '2026-05-01', end: '2026-05-05', workdays: ['2026-05-09'] },
  { name: '端午节', start: '2026-06-19', end: '2026-06-21' },
  { name: '中秋节', start: '2026-09-25', end: '2026-09-27' },
  { name: '国庆节', start: '2026-10-01', end: '2026-10-07', workdays: ['2026-09-20', '2026-10-10'] }
]

const holidayMap = new Map<string, string>()
const workdayMap = new Set<string>()
for (const range of ranges) {
  const date = new Date(`${range.start}T00:00:00`)
  const end = new Date(`${range.end}T00:00:00`)
  while (date <= end) {
    holidayMap.set(date.toISOString().slice(0, 10), range.name)
    date.setDate(date.getDate() + 1)
  }
  range.workdays?.forEach(day => workdayMap.add(day))
}

export function getHolidayInfo(key: string): { type: HolidayType; name: string } | undefined {
  if (workdayMap.has(key)) return { type: 'workday', name: '调休' }
  const name = holidayMap.get(key)
  return name ? { type: 'holiday', name } : undefined
}
