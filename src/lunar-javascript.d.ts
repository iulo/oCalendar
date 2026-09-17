declare module 'lunar-javascript' {
  export const Solar: {
    fromYmd(year: number, month: number, day: number): {
      getLunar(): { getJieQiTable(): Record<string, { toYmd(): string }> }
    }
  }
}
