import fs from 'node:fs/promises';
import path from 'node:path';
import Markdown from 'markdown-to-jsx';
import matter from 'gray-matter';
import Image from 'next/image';
import { getPostMetadata } from '@/lib/postMetadata';
import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';

const getPostContent = unstable_cache(async (locale: string, slug: string) => {
  const filePath = path.join(process.cwd(), 'articles', locale, slug + '.md');
  const file = await fs.readFile(filePath, 'utf-8');
  const matterResult = matter(file);

  return matterResult;
});

export const generateStaticParams = async () => {
  const locales = ['fa', 'en'];
  const postsMetadata = await getPostMetadata();
  const paths = locales.flatMap((locale) =>
    postsMetadata.map((article) => ({
      locale,
      slug: article.slug,
    }))
  );

  return paths;
};

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const post = await getPostContent(locale, slug);
  const { title, summary } = post.data as ArticleMetadata;
  return {
    title,
    description: summary,
  };
}

const Article = async ({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}) => {
  const { content, data } = await getPostContent(locale, slug);
  return (
    <div className="pt-20">
      <h1 className="text-3xl font-bold leading-loose">{data.title}</h1>
      <Image
        src={data.image}
        alt={data.title}
        width={800}
        height={600}
        className="w-full"
      />
      <div className="pt-10 md:max-w-[80%] md:w-[800px] md:mx-auto">
        <Markdown
          options={{
            overrides: {
              h1: {
                props: {
                  className: 'text-xl font-bold leading-loose mt-5',
                },
              },
              h2: {
                props: {
                  className: 'text-lg font-semibold leading-loose',
                },
              },
            },
          }}
        >
          {content}
        </Markdown>
      </div>
    </div>
  );
};

export default Article;
