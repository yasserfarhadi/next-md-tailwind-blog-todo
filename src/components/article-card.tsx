'use client';

import { cn } from '@/lib/utils';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MouseEvent } from 'react';
import { ClockIcon } from '@radix-ui/react-icons';

export default function ArticleCard({
  title,
  image,
  timeToRead,
  summary,
  slug,
  locale,
}: Omit<ArticleMetadata, 'date' | 'lang'> & { locale: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className="group relative max-w-[340px] h-[400px] rounded-xl border dark:border-border bg-secondary dark:bg-secondary/70  pt-[190px] px-5 pb-5 shadow text-slate-500"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute z-0 -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <Image
        src={image}
        alt={title}
        width={300}
        height={170}
        className="rounded-md absolute top-5 left-5 max-w-[calc(100%-40px)] max-h-[170px] min-w-[calc(100%-40px)] min-h-[170px] object-cover"
      />
      <div>
        <div className="mt-2 flex items-center">
          <span className="text-lg font-bold tracking-tight line-clamp-1">
            {title}
          </span>
        </div>
        <p className="flex items-center gap-2">
          <ClockIcon width={20} height={20} />
          <span className="">{timeToRead}</span>
        </p>
        <p className="mt-3 text-base leading text-slate-400 line-clamp-3">
          {summary}
        </p>
      </div>

      <div
        className={cn(
          'mt-3 absolute bottom-5 ',
          locale === 'fa' ? 'left-5' : 'right-5'
        )}
      >
        <Link
          href={`/${locale}/articles/${slug}`}
          className="font-normal py-2 px-5 border shadow rounded-md bg-white/70 dark:bg-secondary"
        >
          {locale === 'en' ? 'Read More' : 'ادامه'}
        </Link>
      </div>
    </div>
  );
}
