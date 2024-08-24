import { Metadata } from 'next';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: locale === 'fa' ? 'بلاگ اپ' : 'Blog App',
    description: locale === 'fa' ? 'بلاگ اپ' : 'Blog App',
  };
}

export default function Home() {
  return (
    <main
      dir="rtl"
      className="flex min-h-screen font-fa flex-col items-center p-24"
    >
      BLOG APP
    </main>
  );
}
