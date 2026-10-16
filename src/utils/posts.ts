import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'

export type BlogPost = CollectionEntry<'blog'>

/** Published posts, newest first. Drafts stay visible while running `astro dev`. */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog')
  return posts
    .filter(post => import.meta.env.DEV || !post.data.draft)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
}
