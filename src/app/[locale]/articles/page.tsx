import ArticleCard from '@/components/article-card';
import { getPostMetadata } from '@/lib/postMetadata';
import { Metadata } from 'next';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: locale === 'fa' ? 'مقالات' : 'Articles',
    description:
      locale === 'fa' ? 'لیست مقالات اخیر' : 'List of latest articles',
  };
}

const Articles = async ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  const frontMatters = await getPostMetadata(locale);
  return (
    <div className="pt-36 pb-24 grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-10 place-items-center">
      {frontMatters.map((front) => (
        <ArticleCard
          key={front.slug}
          title={front.title}
          summary={front.summary}
          slug={front.slug}
          image={front.image}
          timeToRead={front.timeToRead}
          locale={locale}
        />
      ))}
    </div>
  );
};

export default Articles;
