import type { BlogPost } from './posts'

export interface TagSummary {
  tag: string
  slug: string
  count: number
}

/**
 * Reserved control tag. Content carrying it is kept out of the homepage lists,
 * the tag pages and search, and is only reachable from `/archive`.
 */
export const ARCHIVE_TAG = 'archive'

export function isArchiveTag(tag: string): boolean {
  return tag.trim().toLowerCase() === ARCHIVE_TAG
}

export function hasArchiveTag(tags?: string[]): boolean {
  return (tags ?? []).some(isArchiveTag)
}

/**
 * Tags that should be rendered or linked. The reserved archive tag is dropped so
 * it never shows up as a pill pointing at a tag page that does not exist.
 */
export function visibleTags(tags: string[] = [], tagsEn?: string[]): { tags: string[], tagsEn?: string[] } {
  const kept = tags
    .map((tag, index) => ({ tag, labelEn: tagsEn?.[index] }))
    .filter(entry => !isArchiveTag(entry.tag))

  return {
    tags: kept.map(entry => entry.tag),
    tagsEn: tagsEn ? kept.map(entry => entry.labelEn ?? entry.tag) : undefined,
  }
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
