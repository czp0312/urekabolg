# Ureka Blog

基于 [Astro](https://astro.build/) 的静态个人博客：首页展示个人介绍、项目和写作列表，内容以 Markdown / MDX 内容集合为核心，构建时生成静态页面、站点地图和 Open Graph 元数据。线上地址：<https://ureka.top>。

视觉与信息架构参考 [xiaoyu-ops/blog-astro](https://github.com/xiaoyu-ops/blog-astro)，样式使用 Tailwind CSS v4 重写。

## 技术栈

- Astro 7 + MDX，构建时输出纯静态站点
- Tailwind CSS v4（`@tailwindcss/vite` + `@tailwindcss/typography`）
- Astro Content Collections（`blog` / `projects`）
- 客户端双语切换（中文 / 英文），单 URL，不生成多语言路由
- 部署目标：Cloudflare Workers Assets（见 `wrangler.jsonc`）

## 快速开始

需要 Node.js `>=22.12.0`。

```bash
npm ci        # 安装依赖
npm run dev   # 本地开发
npm run build # 构建到 dist/
npm run preview
```

> 依赖锁文件 `package-lock.json` 使用 npm 10 生成，与 Cloudflare 构建环境（npm 10.9.2）保持一致。用 npm 11 执行 `npm install` 会重写锁文件，并让 CI 的 `npm ci` 报 `Missing: @emnapi/core ...`；此时请用 npm 10 重新生成：`npx npm@10 install --package-lock-only`。

需要让开发服务器在后台运行时（例如 AI 助手），使用 Astro 的后台模式：

```bash
npm run astro -- dev --background
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run astro -- dev --background` | 后台启动开发服务器（`dev status` / `dev logs` / `dev stop` 管理） |
| `npm run build` | 构建静态站点到 `dist/` |
| `npm run preview` | 预览构建结果 |
| `npm run lint` | 运行 ESLint |
| `npm run astro -- check` | Astro / TypeScript 类型检查 |
| `npm run new-post -- "<标题>" [slug]` | 新建文章，详见 `src/content/README.md` |
| `npm run format-posts` | 用 autocorrect 整理中文标点与空格 |

## 目录结构

```text
src/
  components/Header.astro      顶部导航（语言 / 主题切换）
  layouts/Layout.astro         全站页面壳、SEO 与 Open Graph 元数据
  pages/index.astro            首页：个人介绍、项目、写作
  pages/blog/[slug].astro      文章详情页
  pages/projects/[slug].astro  项目详情页
  styles/global.css            Tailwind v4 入口、设计变量与组件样式
  content.config.ts            blog / projects 内容集合 schema
  content/blog/                文章（Markdown / MDX）
  content/projects/            项目（Markdown / MDX）
public/
  scripts/site-init.js         首屏主题与语言初始化
  scripts/fade-observer.js     滚动淡入动画
```

## 自定义站点

1. `astro.config.ts` 里的 `site` 已设为 `https://ureka.top`；换域名时改这里，canonical URL 与 sitemap 会跟着变。
2. 首页的个人信息集中在 `src/pages/index.astro` 顶部的 `profile`、`aboutZh`、`aboutEn` 变量。
3. `src/layouts/Layout.astro` 里的 `siteName` 与 `defaultDescription` 决定默认标题和描述。
4. 替换 `public/avatar.svg` 与 `public/icons/favicon.svg`。

## 内容

发布流程、frontmatter 字段说明见 [`src/content/README.md`](src/content/README.md)。
