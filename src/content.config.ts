import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const pages = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: 'src/content/pages',
  }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    kanji: z.string().optional(),
  }),
});

const news = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: 'src/content/news',
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    preview: z.string().optional(),
    type: z.enum(['news', 'event']).default('news'),
    location: z.string().optional(),
    time: z.string().optional(),
    people: z.array(z.string()).optional(),
    display: z.enum(['modal', 'page']).default('page'),
    color: z.enum(['moss', 'sage', 'gold']).default('moss'),
    pdfs: z
      .object({
        de: z.string().optional(),
        en: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = {
  pages,
  news,
};
