import { Metadata } from 'next';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: locale === 'fa' ? 'یاسر فرهادی' : 'Yasser Farhadi',
    description: locale === 'fa' ? 'تسک آزمایشی' : 'Test task',
  };
}

export default function Home() {
  return (
    <main
      dir="rtl"
      className="flex min-h-screen font-fa flex-col items-center p-24"
    >
      <h1 className="text-3xl">تسک آزمایشی شرکت sos</h1>
      <h2 className="text-2xl">یاسر فرهادی</h2>
    </main>
  );
}
