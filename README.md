# 谱间 Pujian

**面向所有乐器学习者的乐理学习与练习网站。** 项目从互动识谱练习开始，计划逐步扩展到节奏、音程、和弦等音乐理论主题。

**An open-source music theory learning and practice website for musicians of all instruments.** It starts with interactive sight-reading practice and is designed to grow into rhythm, intervals, chords, and more.

> 当前代码包含中英双语的钢琴五线谱识读练习原型。更广泛的乐理课程与练习仍在规划中。  
> The current codebase is a Chinese-English piano sight-reading practice prototype. Broader theory lessons and exercises are planned, not yet implemented.

## 当前功能 · What's included

- 高音谱号与低音谱号随机识读，包含加线音符。  
  Random treble- and bass-clef note reading, including ledger lines.
- 升号、降号与混合模式练习。  
  Sharp, flat, and mixed accidental practice.
- 可横向滚动的钢琴键盘，或十二音名称键盘作答。  
  Answer with a scrollable piano keyboard or a twelve-note name pad.
- 答错后可重试；提供提示、唱名、正确率和今日练习数量。  
  Retry after mistakes, use optional hints and solfege, and review accuracy and today's practice count.
- 中英文界面切换，语言偏好与练习设置保存在本地浏览器。  
  Switch between Chinese and English; language and practice preferences are saved locally.
- 无需账号或后端，适配手机、平板与桌面浏览器。  
  No account or backend required; responsive on mobile, tablet, and desktop.

## 规划中 · Roadmap

- 乐理学习 Tab：结构化短课与交互示例。  
  A music theory learning tab with structured lessons and interactive examples.
- 通用乐理练习：节奏、音程、和弦等主题。  
  Instrument-agnostic exercises for rhythm, intervals, chords, and other topics.

## 本地运行 · Run locally

需要 Node.js 20.19+ 或 22.12+。  
Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

创建生产构建并在本地预览：  
Build and preview the production app locally:

```sh
npm run build
npm run preview
```

## 工程结构 · Project structure

```text
src/
├── components/       # 页面组件 / UI components
├── hooks/            # 练习状态 / Practice state
├── lib/              # 乐理逻辑、双语文案与本地存储 / Music logic, i18n, storage
├── styles/           # 全局样式 / Global styles
├── types/            # 共享 TypeScript 类型 / Shared TypeScript types
├── App.tsx
└── main.tsx
.github/workflows/    # GitHub Pages workflow
```

## GitHub Pages

项目包含一个 GitHub Actions Pages 工作流。仓库发布前，需要将 `vite.config.ts` 中的生产环境 `base` 路径改为实际仓库名对应的路径，并在 GitHub 仓库设置中选择 **Pages → Build and deployment → GitHub Actions**。当前项目尚未上传或部署，因此还没有在线演示地址。

The project includes a GitHub Actions workflow for Pages. Before publishing, update the production `base` path in `vite.config.ts` to match the repository name, then select **Pages → Build and deployment → GitHub Actions** in repository settings. This project has not been uploaded or deployed yet, so there is no live demo.

## 隐私 · Privacy

练习数量、语言和偏好设置仅存储在当前浏览器的 `localStorage` 中。项目没有分析追踪、账号系统或应用后端。Google Fonts 在线时会从 Google 加载；系统字体作为备用。

Practice counts, language, and preferences stay in this browser's `localStorage`. There is no analytics, account system, or application backend. Google Fonts load from Google when online, with system font fallbacks.

## 许可证 · License

MIT — 详见 [LICENSE](./LICENSE)。  
MIT — see [LICENSE](./LICENSE).
