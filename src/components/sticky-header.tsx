'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Sidebar from './sidebar';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from '@/context/ThemeProvider';
import Theme from './theme';

function changeLocalInPathname(pathname: string, newLocale: string): string {
  const pathArr = pathname.split('/');
  pathArr[1] = newLocale;
  return pathArr.join('/');
}

const clamp = (number: number, min: number, max: number) =>
  Math.min(Math.max(number, min), max);

function useBoundedScroll(threshold: number) {
  const { scrollY } = useScroll();
  const scrollYBounded = useMotionValue(0);
  const scrollYBoundedProgress = useTransform(
    scrollYBounded,
    [0, threshold],
    [0, 1]
  );

  useEffect(() => {
    return scrollY.on('change', (current) => {
      const previous = scrollY.getPrevious();
      const diff = current - (previous as number);
      const newScrollYBounded = scrollYBounded.get() + diff;

      scrollYBounded.set(clamp(newScrollYBounded, 0, threshold));
    });
  }, [threshold, scrollY, scrollYBounded]);

  return { scrollYBounded, scrollYBoundedProgress };
}

export default function StickyHeader() {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const pathname = usePathname();
  const { mode } = useTheme();

  const { scrollYBoundedProgress } = useBoundedScroll(400);
  const scrollYBoundedProgressDelayed = useTransform(
    scrollYBoundedProgress,
    [0, 0.75, 1],
    [0, 0, 1]
  );

  return (
    <motion.header
      style={{
        height: useTransform(scrollYBoundedProgressDelayed, [0, 1], [80, 50]),
      }}
      className="fixed inset-x-0 flex h-20 bg-white/80 dark:bg-background/80 shadow  backdrop-blur-md md:shadow-secondary z-50"
    >
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-8">
        <div className="flex items-center gap-5">
          <motion.div
            style={{
              opacity: useTransform(
                scrollYBoundedProgressDelayed,
                [0, 1],
                [1, 0]
              ),
            }}
            className="flex items-center md:hidden"
          >
            <Sidebar />
          </motion.div>
          <motion.div
            style={{
              scale: useTransform(
                scrollYBoundedProgressDelayed,
                [0, 1],
                [1, 0.9]
              ),
            }}
            dir="ltr"
            className="flex origin-left items-center text-xl font-semibold uppercase"
          >
            <span className="font-en -ml-1.5 inline-block -rotate-90 text-[10px] leading-[0]">
              BBK
            </span>
            <span className="font-en -ml-1 text-2xl tracking-[-.075em]">
              BBK
            </span>
          </motion.div>
        </div>
        <motion.nav
          style={{
            opacity: useTransform(
              scrollYBoundedProgressDelayed,
              [0, 1],
              [1, 0]
            ),
          }}
          className="md:flex md:gap-5 md:items-center text-md font-medium text-slate-400 hidden"
        >
          <Link className="hover:text-black dark:hover:text-white" href="/">
            {t('home')}
          </Link>
          <Link
            className="hover:text-black dark:hover:text-white"
            href={`/${locale}/articles`}
          >
            {t('articles')}
          </Link>
          <Link
            className="hover:text-black dark:hover:text-white"
            href={`/${locale}/todo`}
          >
            {t('todo-list')}
          </Link>
        </motion.nav>
        <motion.div
          style={{
            opacity: useTransform(
              scrollYBoundedProgressDelayed,
              [0, 1],
              [1, 0]
            ),
          }}
          className="flex gap-5 items-center text-md font-medium text-slate-400"
        >
          <DropdownMenu dir={locale === 'fa' ? 'rtl' : 'ltr'}>
            <DropdownMenuTrigger className="bg-transparent text-foreground">
              <Image
                src={`${locale === 'fa' ? '/icons/iran.svg' : '/icons/us.svg'}`}
                alt={t('lang')}
                width={25}
                height={15}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link
                  href={changeLocalInPathname(pathname, 'fa')}
                  className="block w-full h-full font-fa"
                >
                  فارسی
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={changeLocalInPathname(pathname, 'en')}
                  className="block w-full h-full"
                >
                  English
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Theme />

          <Link
            href="/"
            className="bg-blue-500 text-white py-1.5 px-5 rounded-md"
          >
            {t('login')}
          </Link>
        </motion.div>
      </div>
    </motion.header>
  );
}
