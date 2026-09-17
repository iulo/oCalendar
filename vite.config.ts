import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/oCalendar/',
  plugins: [
    vue(),
    UnoCSS(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: '一页日历',
        short_name: '日历',
        description: '轻巧的全年日历，节日与农历一目了然。',
        theme_color: '#f8f7f4',
        background_color: '#f8f7f4',
        display: 'standalone',
        start_url: '/oCalendar/',
        scope: '/oCalendar/',
        icons: [
          { src: '/oCalendar/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/oCalendar/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})
