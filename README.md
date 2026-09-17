# 一页日历

基于 Vue 3、TypeScript、Vite 和 UnoCSS 的全年日历 PWA。界面与全年日历的交互思路参考 [ZenCalendar](https://github.com/ciaoca/ZenCalendar)，代码为独立实现。

## 功能

- 全年 12 个月浏览、年份切换、回到今天
- 农历、常见节日和二十四节气
- 周起始日、相邻月份日期、周数、固定行数与显示样式设置
- 手机和桌面响应式布局，离线访问及安装为 PWA
- 打印布局

## 本地开发

```bash
npm ci
npm run dev
npm run build
```

## GitHub Pages

推送到 `main` 后，`.github/workflows/deploy.yml` 会构建并发布 `dist`。首次使用时，在仓库 **Settings → Pages → Build and deployment** 中将 Source 设为 **GitHub Actions**。发布地址为 <https://iulo.github.io/oCalendar/>。

如需部署到其他仓库路径，修改 `vite.config.ts` 中的 `base`、PWA `start_url`、`scope` 与图标路径，以及 `index.html` 中的图标路径。
