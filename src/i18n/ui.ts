import type { Language } from '@/i18n/config'

interface Translation {
  title: string
  subtitle: string
  description: string
  posts: string
  tags: string
  about: string
  toc: string
}

export const ui: Record<Language, Translation> = {
  'zh': {
    title: 'Ureka Blog',
    subtitle: '技术与生活的记录',
    description: '欢迎来到我的博客！分享关于技术、编程和生活的思考。',
    posts: '文章',
    tags: '标签',
    about: '关于',
    toc: '目录',
  },
  'en': {
    title: 'Ureka Blog',
    subtitle: 'A blog about technology and life',
    description: 'Welcome to my blog! Sharing thoughts on technology, programming, and life.',
    posts: 'Posts',
    tags: 'Tags',
    about: 'About',
    toc: 'Table of Contents',
  },
}
