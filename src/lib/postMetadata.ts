import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { unstable_cache } from 'next/cache';

export const getPostMetadata = unstable_cache(async (locale: string = 'fa') => {
  const folder = path.join(process.cwd(), 'articles', locale);
  const files = await fs.readdir(folder);
  const mdArticles = files.filter((file) => file.endsWith('.md'));

  const frontMatters: ArticleMetadata[] = [];

  for (const fileName of mdArticles) {
    const filePath = path.join(process.cwd(), 'articles', locale, fileName);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const matterResult = matter(fileContent);
    frontMatters.push({
      title: matterResult.data.title,
      summary: matterResult.data.summary,
      date: matterResult.data.date,
      image: matterResult.data.image,
      lang: matterResult.data.lang,
      timeToRead: matterResult.data.timeToRead,
      slug: fileName.replace('.md', ''),
    } as ArticleMetadata);
  }

  return frontMatters;
});
