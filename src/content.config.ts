import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format')
  .refine(value => !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime()), 'Use a valid date')

function requireReadyDescription(
  value: { description: string, draft?: boolean },
  context: { addIssue: (issue: { code: 'custom', message: string, path: string[] }) => void },
) {
  if (!value.draft && value.description.trim().startsWith('TODO')) {
    context.addIssue({
      code: 'custom',
      message: 'Published content needs a real description',
      path: ['description'],
    })
  }
}

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z
    .object({
      title: z.string(),
      titleEn: z.string().min(1).optional(),
      description: z.string().min(1),
      descriptionEn: z.string().min(1).optional(),
      date: dateString.optional(),
      draft: z.boolean().optional(),
      order: z.number().optional(),
      tags: z.array(z.string()).optional(),
      tagsEn: z.array(z.string()).optional(),
    })
    .superRefine(requireReadyDescription),
})

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z
    .object({
      title: z.string(),
      titleEn: z.string().min(1).optional(),
      description: z.string().min(1),
      descriptionEn: z.string().min(1).optional(),
      date: dateString,
      category: z.enum(['technical', 'notes']).default('technical'),
      bilingual: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).optional(),
    })
    .superRefine(requireReadyDescription),
})

export const collections = { projects, blog }
