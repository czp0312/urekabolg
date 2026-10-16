import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'
import { hasArchiveTag } from './tags'

export type BlogPost = CollectionEntry<'blog'>

function byDateDesc(a: BlogPost, b: BlogPost): number {
  return new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
}

/** Posts that carry the reserved `archive` tag are hidden from every site list. */
export function isArchivedPost(post: BlogPost): boolean {
  return hasArchiveTag(post.data.tags)
}

/** Posts shown across the site, newest first. Drafts stay visible while running `astro dev`. */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog')
  return posts
    .filter(post => import.meta.env.DEV || !post.data.draft)
    .filter(post => !isArchivedPost(post))
    .sort(byDateDesc)
}

/** Archived posts, newest first. Only the `/archive` page lists these. */
export async function getArchivedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog')
  return posts
    .filter(post => import.meta.env.DEV || !post.data.draft)
    .filter(isArchivedPost)
    .sort(byDateDesc)
}
