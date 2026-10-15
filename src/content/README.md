# 内容更新指南

日常更新只做三件事：创建、写作、构建。首页会自动读取内容集合，不需要改首页代码。

## 1. 创建文章

在项目根目录运行。技术文章是默认类型：

```bash
npm run new-post -- "用 Astro 构建个人博客" astro-blog \
  --title-en "Building a Personal Blog with Astro" \
  --description "记录博客的架构、内容管理与部署流程。" \
  --description-en "A practical look at the blog's architecture, content workflow, and deployment."
```

随手写需要显式选择 `notes`：

```bash
npm run new-post -- "秋招复盘" autumn-recruit-review \
  --title-en "Looking Back on Autumn Recruitment" \
  --description "秋招准备、面试复盘和后续计划。" \
  --description-en "Notes on preparation, interviews, and what comes next." \
  --category notes
```

- 省略 `--category` 时默认为 `technical`，与首页默认打开“技术”标签一致。
- 默认创建草稿（`draft: true`），方便先在本地预览。
- `--title-en` 和 `--description-en` 是英文模式的标题与摘要。
- 命令末尾添加 `--publish` 可直接创建非草稿文章。

命令会同时创建：

```text
src/content/blog/YYYY-MM-DD-english-slug.md
src/content/blog/images/YYYY-MM-DD-english-slug/
```

## 2. 写文章和放图片

正文直接写进生成的 Markdown。图片放在文章专属图片目录，然后这样引用：

```md
![图片内容说明](./images/YYYY-MM-DD-english-slug/screenshot.png)

*图 1：这里写图片说明；不需要图注时删掉这一行。*
```

- `![方括号里的文字]` 要描述图片内容，方便无障碍阅读。
- 图片会自动适配电脑和手机宽度，不需要手写 HTML。

本地预览：

```bash
npm run dev
```

需要后台运行时（例如 AI 助手）改用 `npm run astro -- dev --background`，配套命令是 `npm run astro -- dev status|logs|stop`。

打开 `/blog/YYYY-MM-DD-english-slug` 即可。草稿会在本地显示并带 `Draft` 标记，生产构建不会包含草稿。

## 3. 发布

把 frontmatter 里的 `draft` 改成 `false`，确认 `titleEn` / `description` / `descriptionEn` 不再是 `TODO`，然后：

```bash
npm run build
git add src/content/blog
git commit -m "publish: YYYY-MM-DD-english-slug"
git push
```

如果部署平台已经连上仓库的主分支，push 后会自动上线。

## 更新 Project

项目内容放在：

```text
src/content/projects/
```

每个项目一个 `.md` 或 `.mdx` 文件，常用 frontmatter：

```yaml
---
title: "项目名称"
titleEn: "Project Name"
description: "一句话项目介绍"
descriptionEn: "A concise, natural English introduction."
date: "2026-07-21"
draft: false
order: 1
tags:
  - Astro
tagsEn:
  - Astro
---
```

- `draft: true`：本地可预览，生产环境不展示。
- `order`：数字越小，首页 Projects 中越靠前。
- `date`：`order` 相同时用于排序。
- `titleEn`、`descriptionEn`、`tagsEn`：英文模式使用，标签顺序与中文保持一致。

## 字段说明

`src/content.config.ts` 用 zod 校验 frontmatter，写错字段名或格式会在构建时直接报错。

博客文章（`src/content/blog/`）：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 中文标题 |
| `titleEn` | 否 | 英文标题，缺省时回退到 `title` |
| `description` | 是 | 首页摘要，不能以 `TODO` 开头（除非是草稿） |
| `descriptionEn` | 否 | 英文摘要，缺省时回退到 `description` |
| `date` | 是 | `YYYY-MM-DD` 字符串 |
| `category` | 否 | `technical`（默认）或 `notes`，决定首页落在哪个标签页 |
| `bilingual` | 否 | 正文本身就是中英双语时设为 `true`，英文模式不再提示“仅有中文” |
| `draft` | 否 | `true` 时只在开发模式显示 |
| `tags` | 否 | 标签数组 |

## 什么时候才需要改前端

日常更新文章或项目时不要修改：

```text
src/pages/index.astro
src/pages/blog/[slug].astro
src/pages/projects/[slug].astro
src/styles/global.css
```

这些文件已经负责自动生成首页列表、详情页和图片排版，只有要改变整个网站的布局或样式时才修改。

不要在 `src/content/blog/` 或 `src/content/projects/` 里放普通说明用的 Markdown；这两个目录中的 Markdown 都会被 Astro 当作网站内容。使用说明统一维护在当前文件中。
