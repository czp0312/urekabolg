# AGENTS.md

## 项目概述

Ureka Blog 是一个基于 Astro 的静态个人博客，视觉与信息架构参考 [xiaoyu-ops/blog-astro](https://github.com/xiaoyu-ops/blog-astro)（旧版 Retypeset 主题已整体移除）。站点内容以 Markdown/MDX 内容集合为核心，构建时生成首页、文章页、项目页、404、robots.txt 和站点地图；首页个人介绍、项目和写作列表都由内容集合自动生成。

当前仓库事实：

- 项目名称：`urekablog`（见 `package.json`）。
- 运行环境：Node.js `>=22.12.0`，ESM 项目（`"type": "module"`）。
- 主要框架：Astro `^7.3.8`，集成 `@astrojs/mdx` `^8.0.3`、`@astrojs/sitemap` `^3.7.4`。
- 语言：TypeScript、Astro、JavaScript/MJS、Markdown/MDX、CSS。
- 样式：Tailwind CSS v4（`tailwindcss` + `@tailwindcss/vite` + `@tailwindcss/typography`），设计变量定义在 `src/styles/global.css` 的 `@theme` 和 `:root` / `.dark`。UnoCSS 已移除。
- 内容能力：Astro Content Collections（`glob` loader + `astro/zod` schema）、MDX、Shiki（`github-dark`）。
- 多语言：纯客户端实现（`<html data-lang>` + `localStorage`），每个页面只有一个 URL，不生成 `/en/` 之类的语言前缀路由。
- 站点 URL：`https://ureka.top`（`astro.config.ts` 的 `site`），影响 canonical、Open Graph 和 sitemap。
- 部署配置：`wrangler.jsonc` 指向 Cloudflare Workers Assets，部署目录为 `./dist`。
- 包管理器：npm，仓库只提交 `package-lock.json`。不要引入 `pnpm-lock.yaml`、`yarn.lock`、`bun.lockb` 等其他锁文件。

## 关键目录与文件

- `astro.config.ts`：Astro 配置入口，设置 `site`、`image.layout`、MDX/Sitemap 集成、Tailwind Vite 插件和 Shiki 主题。这是唯一的全局配置入口，站点信息不再集中在单独的 config 文件里。
- `src/content.config.ts`：内容集合 schema，包含 `blog` 和 `projects` 两个集合，用 `astro/zod` 校验 frontmatter；`requireReadyDescription` 会拦截非草稿内容里以 `TODO` 开头的 `description`。
- `src/content/blog/`：文章 Markdown/MDX，文件名为 `YYYY-MM-DD-english-slug.md`，slug 即文件名（不含扩展名），对应路由 `/blog/<slug>`。
- `src/content/projects/`：项目 Markdown/MDX，slug 即文件名，对应路由 `/projects/<slug>`。
- `src/content/README.md`：面向写作者的发布流程与 frontmatter 字段说明。修改内容 schema 时必须同步更新。
- `src/pages/index.astro`：首页（Hero、About、Projects、Writing 标签页）。个人介绍文案集中在文件顶部的 `profile`、`aboutZh`、`aboutEn` 变量。
- `src/pages/blog/[slug].astro`：文章详情页，使用 `render()` 拿 `headings` 生成快捷跳转目录（收集全部 1-6 级标题，按层级缩进，标题数 >= 3 时渲染），渲染 frontmatter 的 `tags` / `tagsEn` 标签胶囊，正文走 `prose` 排版。
- `src/pages/projects/[slug].astro`：项目详情页，正文走 `.project-content` 样式。
- `src/pages/404.astro`：Tailwind 重写的 404 页面。
- `src/pages/robots.txt.ts`：生成 robots.txt 并指向 sitemap。
- `src/pages/tags/index.astro`：标签总览页（`/tags`），列出全部标签与文章数量。
- `src/pages/tags/[tag].astro`：单标签文章列表页（`/tags/<tag>`），按标签筛选文章。
- `src/pages/search.astro`：搜索页（`/search`），构建期把标题、摘要、标签和正文纯文本写入 `application/json` 索引，客户端按语言检索；正文用正则剥离 Markdown 语法。
- `src/pages/archive.astro`：归档页（`/archive`），唯一列出「带 `archive` 标签的文章」的页面。
- `src/components/Footer.astro`：全站页脚，包含标签 / 归档入口与版权信息。
- `src/components/PostList.astro`：文章列表组件，用「拉伸链接 + `sr-only` 标题」保证整卡可点，同时让标签链接保持独立可点。
- `src/components/TagPills.astro`：标签胶囊组件，`links` 为 `true` 时链到 `/tags/<tag>`。
- `src/utils/posts.ts`：`getPublishedPosts()`（排除草稿与归档，按日期倒序）、`getArchivedPosts()`、`isArchivedPost()`。
- `src/utils/tags.ts`：`tagSlug()` / `collectTags()` / `postsWithTag()`，以及归档控制标签的 `ARCHIVE_TAG` / `isArchiveTag()` / `hasArchiveTag()` / `visibleTags()`。
- `src/layouts/Layout.astro`：全站页面壳，包含 `siteName`、`defaultDescription`、canonical、Open Graph、Twitter Card、favicon、网格背景 SVG，并引入 `site-init.js` 与 `fade-observer.js`。
- `src/components/Header.astro`：固定顶部导航（`/search`、`/#about`、`/#projects`、`/#posts`）、语言切换和主题切换。语言/主题切换逻辑写在该文件的 `<script>` 中。
- `src/styles/global.css`：Tailwind v4 入口、`@theme` 变量、`@keyframes`、`:root` / `.dark` 设计变量、`html[data-lang]` 显隐规则，以及 `.fade-up`、`.border-beam`、`.color-slide`、`.decorate-bar`、`.blog-content`、`.project-content`、`.prose` 等组件层样式。
- `public/scripts/site-init.js`：首屏内联执行的脚本，负责在渲染前写入 `data-lang` 和 `dark` 类，避免闪烁。
- `public/scripts/fade-observer.js`：用 IntersectionObserver 给 `.fade-up` 元素加 `.fade-visible`。
- `public/avatar.jpg`（512x512 方图，首页头像与默认 Open Graph 图片）、`public/icons/favicon.svg`：站点图像资源，可替换。`public/avatar.svg` 是主题自带占位图，已不再被引用。
- `scripts/new-post.ts`：新建文章（写入 `src/content/blog/` 并创建同名图片目录）。
- `scripts/format-posts.ts`：用 `autocorrect-node` 整理 `src/content/**/*.{md,mdx}` 的中文标点与空格。
- `wrangler.jsonc`：Cloudflare Workers Assets 配置，`name` 为 `urekablog`，`assets.directory` 为 `./dist`。
- `.editorconfig` / `.gitattributes` / `.gitignore`：编辑器、换行（LF）和忽略规则。

## 开发环境与依赖安装

1. 先确认 Node.js 版本满足 `>=22.12.0`：

   ```bash
   node --version
   ```

2. 当前仓库以 `package-lock.json` 为准，优先使用 npm 安装：

   ```bash
   npm ci
   ```

   日常增量安装可使用 `npm install`。

3. 不要新增其他锁文件。`vite` 不再作为直接依赖固定版本：Astro 7 自带 Vite 8，手工把 `vite` 固定到旧主版本会导致 `@tailwindcss/vite` 与 Vite 的解析器不兼容、构建直接失败。

## 项目命令

以下命令均来自当前 `package.json` 或 `astro` CLI 传参；不要添加不存在的脚本名称。

| 场景 | 命令 | 说明 |
| --- | --- | --- |
| 开发服务器（AI 必须用这个） | `npm run astro -- dev --background` | Astro 7 支持后台模式，会立刻返回并打印 pid、状态、日志命令。 |
| 查看开发服务器状态 | `npm run astro -- dev status` | 显示是否运行、pid 与 uptime。 |
| 查看开发服务器日志 | `npm run astro -- dev logs` | 可用 `--follow` 持续跟踪。 |
| 停止开发服务器 | `npm run astro -- dev stop` | 停止后台 dev server。 |
| 普通前台开发 | `npm run dev` | 仅用于人工交互式开发；AI 启动 dev server 时必须用后台模式。 |
| 构建 | `npm run build` | 输出静态站点到 `dist/`，同时生成 `sitemap-index.xml`。 |
| 预览 | `npm run preview` | 预览已构建结果；通常先运行 `npm run build`。 |
| Lint | `npm run lint` | 运行 `eslint .`。当前 ESLint 配置忽略 `src/content/**` 和 `public/**`。 |
| 自动修复 Lint | `npm run lint:fix` | 会修改文件，仅在用户要求或明确适合时运行。 |
| Astro/类型检查 | `npm run astro -- check` | 使用已存在的 `astro` 脚本传参；未单独封装为 `check` 脚本。 |
| 新建文章 | `npm run new-post -- "<标题>" [english-slug] [选项]` | 在 `src/content/blog/` 创建 Markdown 和同名图片目录，属于内容写入操作。选项：`--category notes`、`--title-en`、`--description`、`--description-en`、`--publish`。 |
| 格式化文章 | `npm run format-posts` | 使用 `autocorrect-node` 修改 `src/content/**/*.{md,mdx}` 正文。 |
| 测试 | 待确认 | 当前未发现 `test` 脚本或自动化测试目录；`src/content/blog/2026-07-03-testing.md` 是文章内容，不是测试用例。 |
| 全仓库格式化 | 待确认 | 当前未发现 Prettier 或通用 format 脚本；代码格式主要由 ESLint 和 `.editorconfig` 约束。 |

## 架构与主要数据流

1. `astro.config.ts` 设置 `site`、`image.layout: 'constrained'`、`@astrojs/mdx`、`@astrojs/sitemap`、`@tailwindcss/vite` 和 Shiki 主题。
2. `src/content.config.ts` 用 `glob({ base: './src/content/blog' })` 和 `glob({ base: './src/content/projects' })` 加载内容，并用 zod schema 校验 frontmatter；条目 id 由文件名 slug 化得到。
3. 页面在 `getStaticPaths()` 里用 `getCollection()` 取数据：`import.meta.env.DEV || !post.data.draft` 决定草稿是否可见，因此开发模式能看到草稿、生产构建会过滤掉。
4. `src/pages/index.astro` 读取 `blog` 与 `projects`，按 `date` 倒序 / `order` + `date` 排序，并按 `category` 把文章分到 `technical` 和 `notes` 两个标签页；标签页切换由页面底部 `<script>` 驱动。
5. `Layout.astro` 统一输出 head 元数据（canonical、OG、Twitter）与网格背景，并在 `<head>` 里内联 `site-init.js`，在 `</body>` 前加载 `fade-observer.js`。
6. 语言切换在 `Header.astro` 的脚本里：修改 `document.documentElement.dataset.lang` 与 `lang`，写回 `localStorage`；显示/隐藏由 `src/styles/global.css` 的 `html[data-lang="zh"] [data-lang="en"]` 规则完成。所有双语文案都写成成对的 `<span data-lang="zh">…</span><span data-lang="en">…</span>`。
7. 主题切换同样是客户端行为：`site-init.js` 依据 `localStorage` / `prefers-color-scheme` 加 `.dark`，Header 的按钮负责切换，颜色全部来自 `global.css` 的 HSL 变量。
8. 滚动淡入由 `fade-observer.js` + `.fade-up` / `.fade-delay-N` 完成；`.js` 类保证没有 JavaScript 时内容依然可见。
9. 生产部署以 `npm run build` 生成 `dist/`，`wrangler.jsonc` 把 `dist/` 作为 Cloudflare Workers Assets 发布目录。

## 代码规范与命名规则

- 遵守 `.editorconfig`：UTF-8、LF、2 空格缩进、文件末尾换行；Markdown 允许保留行尾空格。
- TypeScript/Astro 使用 ESM import/export，不加分号、用单引号；这是 `@antfu/eslint-config` 的既有约定，`npm run lint` 会检查。
- Astro 组件使用 PascalCase 文件名（`Layout.astro`、`Header.astro`）。
- 样式优先使用 Tailwind 原子类；需要复用的视觉片段写成 `global.css` 的 `@layer components` 规则，不要新建 CSS 文件。
- 颜色不要硬编码：使用 `hsl(var(--foreground))`、`hsl(var(--muted-foreground))`、`hsl(var(--border))`、`hsl(var(--muted))` 等变量，保证明暗主题一致。
- 双语内容必须成对书写 `<span data-lang="zh">` / `<span data-lang="en">`，并在需要无障碍文案时补 `data-language-aria-*` 或 `data-language-alt-*`。
- 内容 frontmatter 必须符合 `src/content.config.ts` 的 schema；`blog.date` 是 `YYYY-MM-DD` 字符串，`category` 只能是 `technical` 或 `notes`。
- 新增页面时使用 `Layout` + `Header` 组合，并给 `<Layout>` 传 `title` / `description`，需要时传 `type="article"` 与 `publishedTime`。
- 不要在业务代码中硬编码域名；需要绝对 URL 时使用 `Astro.site`。

## 内容、配置、环境变量与静态资源

- 构建配置：`astro.config.ts`、`tsconfig.json`、`eslint.config.mjs`。
- 内容集合配置：`src/content.config.ts`。
- 文章内容：`src/content/blog/`；项目内容：`src/content/projects/`。
- 内容写作指南：`src/content/README.md`。
- 首页个人信息：`src/pages/index.astro` 顶部的 `profile`、`aboutZh`、`aboutEn`。
- 站点默认标题与描述：`src/layouts/Layout.astro` 的 `siteName`、`defaultDescription`。
- 静态公共资源：`public/`，会按原路径发布；`public/scripts/` 是运行时脚本，不参与打包，ESLint 也忽略该目录。
- 环境变量：`.env` 和 `.env.production` 被 `.gitignore` 忽略；当前没有自定义 env schema 或 `PUBLIC_*` 约定。新增环境变量前必须确认 Astro 暴露规则和部署平台配置。
- 不要提交密钥、Token、Cookie、证书或真实用户隐私数据。
- 站点有标签页（`/tags`、`/tags/<tag>`）、搜索页（`/search`）和归档页（`/archive`），但没有 RSS/Atom、评论系统和访问量统计；这些能力在主题移植时被有意移除，需要时再单独引入。
- 搜索是纯客户端的：索引在构建期由 `src/pages/search.astro` 内联进 HTML，没有第三方服务，也没有额外的构建步骤或依赖。
- `archive` 是保留的控制标签：带它的文章不进首页写作列表、不进标签页、不进搜索，只在 `/archive` 列出，标签胶囊里也不会渲染它。

## 修改后的验证流程

根据修改范围选择最小必要验证：

1. 只改文档或 AGENTS：检查 diff，确认未改业务代码；通常无需构建。
2. 改 TypeScript/Astro/组件/配置：至少运行 `npm run lint` 和 `npm run astro -- check`。
3. 改路由、内容 schema、Markdown 渲染或部署配置：运行 `npm run build`。
4. 改前端交互、主题切换、语言切换或视觉布局：用 `npm run astro -- dev --background` 起后台服务（或构建后 `npm run preview`）实际打开页面检查，检查完记得 `npm run astro -- dev stop`。
5. 改文章正文并需要中文标点/空格整理时，才运行 `npm run format-posts`；运行前后必须检查内容 diff。
6. 当前没有已确认的自动化测试命令；不要声称“测试已通过”，除非实际运行了明确的验证命令。

## Git 操作规范

- 未经用户明确要求，不执行 `git commit`、`git push`、`git pull`、`git rebase`、`git reset`、`git clean`、删除分支或部署。
- 不使用 `git add .`；如用户要求提交，只暂存本次任务相关文件。
- 修改前后用 `git status --short` 或等价方式确认工作区范围。
- 发现用户已有改动时不得覆盖；如果与当前任务冲突，先说明风险并请求确认。
- 注意 `CLAUDE.md` 是指向 `AGENTS.md` 的符号链接（git 中 mode `120000`）：只改 `AGENTS.md` 即可，不要把它展开成独立文件。

## AI 编程助手项目规则

- 修改前必须阅读相关文件，尤其是 `astro.config.ts`、`src/content.config.ts`、`src/pages/index.astro`、`src/layouts/Layout.astro` 和目标功能附近代码。
- 优先最小范围修改，保持现有 Astro + Tailwind v4 结构和风格。
- 不重构无关代码，不移动目录，不重命名公共路由，不删除已有功能、配置、脚本或注释，除非用户明确要求。
- 不引入不必要依赖；如确需新增依赖，先说明用途、替代方案、影响范围和锁文件变化。
- 修改 `astro.config.ts`、`src/content.config.ts`、`wrangler.jsonc` 前必须确认对路由、构建、部署、SEO 或内容 schema 的影响。
- AI 启动开发服务器时必须使用后台模式：`npm run astro -- dev --background`。管理命令使用 `npm run astro -- dev status`、`npm run astro -- dev logs`、`npm run astro -- dev stop`。
- 不在未请求时运行会写文件或影响 Git 的维护脚本：`npm run lint:fix`、`npm run format-posts`、`npm run new-post`。
- 完成后执行与修改范围匹配的可用验证命令；如果环境缺少 Node 或命令失败，必须如实说明原因和已执行命令。
- 未经明确要求，不执行提交、推送、部署、删除操作或破坏性清理。
- 涉及 Astro 路由、组件、内容集合、样式时，先查阅项目现有实现；必要时参考 Astro 官方文档：
  - https://docs.astro.build
  - Routing: https://docs.astro.build/en/guides/routing/
  - Astro components: https://docs.astro.build/en/basics/astro-components/
  - Content collections: https://docs.astro.build/en/guides/content-collections/
  - Styling: https://docs.astro.build/en/guides/styling/
  - Tailwind CSS v4: https://tailwindcss.com/docs/theme
