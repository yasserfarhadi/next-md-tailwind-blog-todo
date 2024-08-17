import localFont from 'next/font/local';
import StickyHeader from '@/components/sticky-header';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import './globals.css';
import ThemeProvider from '@/context/ThemeProvider';
import { getTheme } from '@/lib/getTheme';

const Yekan = localFont({
  src: '../../assets/fonts/Yekan.ttf',
  variable: '--font-Yekan',
});

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <html lang={locale} dir={locale === 'en' ? 'ltr' : 'rtl'}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getTheme }} />
      </head>
      <NextIntlClientProvider messages={messages}>
        <body className={`font-fa ${Yekan.variable} rtl:font-fa ltr:font-en`}>
          <ThemeProvider>
            <div className="w-full h-full container flex flex-col">
              <StickyHeader />
              <div className="flex-grow">{children}</div>
            </div>
          </ThemeProvider>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
