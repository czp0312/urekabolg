/**
 * Create a new blog post with frontmatter.
 *
 * Usage:
 *   npm run new-post -- "文章标题" [english-slug] [options]
 *
 * Options:
 *   --category <technical|notes>   Defaults to technical.
 *   --title-en <text>              English title used by the English layout.
 *   --description <text>           Chinese summary shown on the homepage.
 *   --description-en <text>        English summary.
 *   --publish                      Create the post as a published article.
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

const args = process.argv.slice(2)

function readOption(name: string): string | undefined {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? undefined : args[index + 1]
}

// Flags are followed by their value, so anything else is a positional argument.
const positional = args.filter((arg, index) => !arg.startsWith('--') && !args[index - 1]?.startsWith('--'))
const [title, slugArg] = positional

if (!title) {
  console.error('❌ Missing title. Example: npm run new-post -- "用 Astro 写博客" astro-blog')
  process.exit(1)
}

const today = new Date().toISOString().slice(0, 10)
const slug = (slugArg ?? `post-${Date.now()}`)
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9-]+/g, '-')
  .replace(/^-+|-+$/g, '')

const category = readOption('category') ?? 'technical'
if (category !== 'technical' && category !== 'notes') {
  console.error(`❌ Unknown category "${category}". Use "technical" or "notes".`)
  process.exit(1)
}

const draft = !args.includes('--publish')
const postId = `${today}-${slug}`
const filePath = join('src/content/blog', `${postId}.md`)
const imageDir = join('src/content/blog/images', postId)

if (existsSync(filePath)) {
  console.error(`❌ File already exists: ${filePath}`)
  process.exit(1)
}

mkdirSync(imageDir, { recursive: true })

const quote = (value: string) => `"${value.replace(/"/g, '\\"')}"`

const frontmatter = [
  '---',
  `title: ${quote(title)}`,
  `titleEn: ${quote(readOption('title-en') ?? 'TODO')}`,
  `description: ${quote(readOption('description') ?? 'TODO')}`,
  `descriptionEn: ${quote(readOption('description-en') ?? 'TODO')}`,
  `date: ${quote(today)}`,
  `category: ${quote(category)}`,
  `draft: ${draft}`,
  'tags:',
  '  - Tag',
  '---',
  '',
].join('\n')

try {
  writeFileSync(filePath, frontmatter, 'utf8')
}
catch (error) {
  console.error('❌ Failed to create post:', error)
  process.exit(1)
}

console.log(`✅ Post created: ${filePath}`)
console.log(`🖼  Images folder: ${imageDir}`)
console.log(`🔗 Local preview: /blog/${postId}`)

if (draft) {
  console.log('ℹ️  This post is a draft. Set `draft: false` (or use --publish) to ship it.')
}
