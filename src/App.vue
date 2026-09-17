<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { dateKey, getLunar, monthDays, type CalendarDay } from './calendar'

type Theme = 'paper' | 'grid'
type Settings = {
  version: number
  weekStart: number
  showAdjacent: boolean
  showWeekNumbers: boolean
  fixedRows: boolean
  theme: Theme
}

const now = new Date()
const currentYear = now.getFullYear()
const stored = (() => {
  try { return JSON.parse(localStorage.getItem('ocalendar-settings') || '{}') as Partial<Settings> }
  catch { return {} }
})()
const settings = ref<Settings>({
  version: 2,
  weekStart: stored.version === 2 && stored.weekStart === 0 ? 0 : 1,
  showAdjacent: stored.showAdjacent ?? true,
  showWeekNumbers: stored.showWeekNumbers ?? false,
  fixedRows: stored.fixedRows ?? false,
  theme: stored.theme === 'grid' ? 'grid' : 'paper'
})
watch(settings, value => localStorage.setItem('ocalendar-settings', JSON.stringify(value)), { deep: true })

const year = ref(currentYear)
const selected = ref<CalendarDay | null>(null)
const settingsOpen = ref(false)
const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
const weekdays = computed(() => settings.value.weekStart === 1
  ? ['一', '二', '三', '四', '五', '六', '日']
  : ['日', '一', '二', '三', '四', '五', '六'])
const months = computed(() => monthNames.map((name, index) => ({
  name, index, days: monthDays(year.value, index, settings.value.weekStart, settings.value.fixedRows)
})))
const selectedTitle = computed(() => selected.value?.date.toLocaleDateString('zh-CN', {
  year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
}) ?? '')

function changeYear(delta: number) {
  year.value = Math.max(1900, Math.min(2100, year.value + delta))
  selected.value = null
}

async function goToday() {
  year.value = currentYear
  selected.value = null
  await nextTick()
  document.getElementById(`day-${dateKey(now)}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function selectDay(day: CalendarDay) {
  selected.value = day
}

function handleYearInput(event: Event) {
  const input = event.target as HTMLInputElement
  const value = Number(input.value)
  if (Number.isInteger(value) && value >= 1900 && value <= 2100) year.value = value
  else input.value = String(year.value)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    selected.value = null
    settingsOpen.value = false
  }
}

const selectedLunar = computed(() => selected.value ? getLunar(selected.value.date).label : '')
</script>

<template>
  <div class="app-shell min-h-screen text-stone-800" :class="`theme-${settings.theme}`" @keydown="handleKeydown">
    <header class="page-header sticky top-0 z-30 bg-[#f8f7f4]/92 backdrop-blur-lg">
      <div class="toolbar mx-auto max-w-1500px px-3 sm:px-7 lg:px-11 flex items-center justify-between gap-2">
        <h1 class="m-0 shrink-0 text-lg sm:text-xl font-700 tracking-tight text-stone-900">哦！日历</h1>
        <nav class="flex items-center gap-1 sm:gap-2" aria-label="日历操作">
          <div class="year-control surface rounded-full flex items-center p-1">
            <button class="icon-button h-8 w-7 sm:w-8 text-xl" type="button" aria-label="上一年" :disabled="year <= 1900" @click="changeYear(-1)">‹</button>
            <label class="sr-only" for="year-input">年份</label>
            <input id="year-input" class="year-input w-12 sm:w-13 border-0 bg-transparent text-center text-sm font-600 text-stone-700 tabular-nums outline-none" type="number" min="1900" max="2100" :value="year" @change="handleYearInput" />
            <button class="icon-button h-8 w-7 sm:w-8 text-xl" type="button" aria-label="下一年" :disabled="year >= 2100" @click="changeYear(1)">›</button>
          </div>
          <button class="surface rounded-full px-3 sm:px-4 h-10 text-sm font-600 cursor-pointer hover:bg-stone-50" type="button" @click="goToday">今天</button>
          <button class="icon-button h-10 w-10" type="button" aria-label="打开设置" @click="settingsOpen = true">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2" fill="var(--page-bg)"/><circle cx="15" cy="17" r="2" fill="var(--page-bg)"/></svg>
          </button>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-1500px px-3 sm:px-7 lg:px-11 pt-3 sm:pt-5 pb-14">
      <div class="year-grid grid grid-cols-1 lg:grid-cols-2 gap-x-5 lg:gap-x-8 gap-y-5 sm:gap-y-7">
        <section v-for="month in months" :key="month.index" class="month-card surface rounded-2xl sm:rounded-3xl p-3 sm:p-5 lg:p-6" :aria-label="`${year}年${month.index + 1}月`">
          <header class="month-header flex items-baseline justify-between px-2 sm:px-3 mb-5 sm:mb-6">
            <h2 class="m-0 flex items-baseline gap-2"><span class="month-index text-3xl sm:text-4xl font-700 tabular-nums">{{ String(month.index + 1).padStart(2, '0') }}</span><span class="text-sm font-600 text-stone-500">{{ month.name }}</span></h2>
            <span class="text-xs font-600 tracking-widest text-stone-400">{{ year }}</span>
          </header>
          <div class="calendar-grid" :class="{ 'with-weeks': settings.showWeekNumbers }">
            <span v-if="settings.showWeekNumbers" class="weekday week-label">周</span>
            <span v-for="(weekday, index) in weekdays" :key="weekday" class="weekday" :class="{ 'weekend-label': index === 0 && settings.weekStart === 0 || index === 6 }">{{ weekday }}</span>
            <template v-for="(day, index) in month.days" :key="day.key">
              <span v-if="settings.showWeekNumbers && index % 7 === 0" class="week-number">{{ day.weekNumber }}</span>
              <button
                class="day-cell"
                :class="{ 'outside': !day.inMonth, 'is-today': day.isToday, 'is-selected': selected?.key === day.key, 'is-weekend': day.isWeekend, 'has-festival': day.festival, 'is-empty': !day.inMonth && !settings.showAdjacent }"
                :id="day.inMonth ? `day-${day.key}` : undefined"
                :aria-label="`${day.date.toLocaleDateString('zh-CN')} ${day.festival || day.solarTerm || day.lunar}${day.isToday ? ' 今天' : ''}`"
                :aria-pressed="selected?.key === day.key"
                :disabled="!day.inMonth && !settings.showAdjacent"
                type="button"
                @click="selectDay(day)"
              >
                <span v-if="day.inMonth || settings.showAdjacent" class="day-content">
                  <span class="day-number">{{ day.day }}</span>
                  <span class="day-subtitle" :class="{ 'special': day.festival || day.solarTerm }">{{ day.festival || day.solarTerm || day.lunar }}</span>
                  <span v-if="day.isToday" class="today-dot" aria-hidden="true"></span>
                </span>
              </button>
            </template>
          </div>
        </section>
      </div>
      <footer class="text-center text-xs text-stone-400 pt-10 pb-4">今年到底了哦～</footer>
    </main>

    <div v-if="selected" class="dialog-backdrop" @click.self="selected = null">
      <section class="detail-panel surface" role="dialog" aria-modal="true" aria-label="日期详情">
        <button class="icon-button absolute right-4 top-4 h-9 w-9" type="button" aria-label="关闭日期详情" @click="selected = null">×</button>
        <p class="m-0 text-xs font-700 tracking-[.25em] text-orange-700">DATE / 日期</p>
        <p class="my-3 text-3xl font-700 text-stone-900">{{ selectedTitle }}</p>
        <p class="m-0 text-stone-500">农历 {{ selectedLunar }}<span v-if="selected.festival || selected.solarTerm"> · {{ selected.festival || selected.solarTerm }}</span></p>
      </section>
    </div>

    <div v-if="settingsOpen" class="dialog-backdrop" @click.self="settingsOpen = false">
      <section class="settings-panel surface" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div class="flex items-center justify-between mb-4">
          <div><p class="m-0 mb-1 text-xs font-700 tracking-[.2em] text-orange-700">PREFERENCES</p><h2 id="settings-title" class="m-0 text-2xl">日历设置</h2></div>
          <button class="icon-button h-10 w-10 text-2xl" type="button" aria-label="关闭设置" @click="settingsOpen = false">×</button>
        </div>
        <label class="setting-row"><span>每周从周日开始</span><input v-model="settings.weekStart" type="checkbox" :true-value="0" :false-value="1" /></label>
        <label class="setting-row"><span>显示前后月份日期</span><input v-model="settings.showAdjacent" type="checkbox" /></label>
        <label class="setting-row"><span>显示周数</span><input v-model="settings.showWeekNumbers" type="checkbox" /></label>
        <label class="setting-row"><span>每月固定六行</span><input v-model="settings.fixedRows" type="checkbox" /></label>
        <div class="pt-5"><p class="m-0 mb-3 font-600">显示样式</p><div class="grid grid-cols-2 gap-3"><button class="theme-option" :class="{ active: settings.theme === 'paper' }" type="button" @click="settings.theme = 'paper'">留白</button><button class="theme-option" :class="{ active: settings.theme === 'grid' }" type="button" @click="settings.theme = 'grid'">格子</button></div></div>
        <button class="mt-7 w-full rounded-xl bg-stone-900 px-5 py-3 text-white font-600 cursor-pointer border-0 hover:bg-stone-700" type="button" @click="settingsOpen = false">完成</button>
      </section>
    </div>
  </div>
</template>
