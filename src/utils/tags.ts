import type { BlogPost } from './posts'

export interface TagSummary {
  tag: string
  slug: string
  count: number
}

/** URL segment for a tag; ASCII tags get lowercased, spaces become dashes. */
export function tagSlug(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, '-')
}

/** All tags used by the given posts, most used first. */
export function collectTags(posts: BlogPost[]): TagSummary[] {
  const counts = new Map<string, number>()

  for (const post of posts) {
    for (const tag of post.data.tags ?? [])
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, slug: tagSlug(tag), count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh'))
}

export function postsWithTag(posts: BlogPost[], slug: string): BlogPost[] {
  return posts.filter(post => (post.data.tags ?? []).some(tag => tagSlug(tag) === slug))
}
