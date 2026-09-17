import { defineConfig, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  shortcuts: {
    'icon-button': 'inline-flex items-center justify-center rounded-full border-0 bg-transparent text-stone-700 cursor-pointer transition-colors hover:bg-stone-200/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-800',
    'surface': 'bg-white/90 border border-stone-200/80 shadow-sm',
    'setting-row': 'flex items-center justify-between gap-4 py-3 border-b border-stone-200/70'
  }
})
