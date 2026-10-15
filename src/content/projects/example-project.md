---
title: "示例项目"
titleEn: "Example Project"
description: "这是一个示例项目条目，用来展示首页和详情页的排版，可以直接替换成你自己的项目。"
descriptionEn: "A sample project entry that shows the homepage and detail layouts. Replace it with your own work."
date: "2026-07-03"
draft: false
order: 1
tags:
  - Astro
tagsEn:
  - Astro
---

## 这是什么

`src/content/projects/` 里的每个 Markdown 文件都会变成一个项目页：首页的 **项目** 区域会列出它，点击后进入 `/projects/<文件名>` 的详情页。

这个文件是一个可以直接删掉的示例，用来确认排版是否正常。

## 怎么写

- frontmatter 里 `title` 和 `description` 是必填项，`titleEn` / `descriptionEn` 供英文模式使用。
- `order` 越小越靠前；`order` 相同时按 `date` 倒序排列。
- 正文支持普通 Markdown 和 MDX，图片放在 `public/images/` 下，用 `/images/xxx.png` 引用。

## 示例代码块

```bash
npm run build
```

修改完成后记得运行 `npm run build` 确认构建通过。
