import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';
import { MixerVerticalIcon } from '@radix-ui/react-icons';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from 'next-intl';

const Filter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') || 'all';
  const t = useTranslations('Todo');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  function changeHandler(value: string) {
    router.push(pathname + '?' + createQueryString('filter', value));
  }

  return (
    <>
      <div className="md:hidden flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="bg-white text-foreground flex items-center gap-1">
            <MixerVerticalIcon className="h-4 w-4" />
            {t('filters')}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => changeHandler('all')}>
              {t('all')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeHandler('completed')}>
              {t('completed')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeHandler('incomplete')}>
              {t('incomplete')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeHandler('important')}>
              {t('important')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden md:flex gap-3 items-center text-xs">
        <label className="flex gap-0.5 items-center">
          <input
            name="filter"
            type="radio"
            checked={filter === 'all'}
            onChange={(e) => e.target.checked && changeHandler('all')}
          />
          {t('all')}
        </label>
        <label className="flex gap-0.5 items-center">
          <input
            name="filter"
            type="radio"
            checked={filter === 'completed'}
            onChange={(e) => e.target.checked && changeHandler('completed')}
          />
          {t('completed')}
        </label>
        <label className="flex gap-0.5 items-center">
          <input
            name="filter"
            type="radio"
            checked={filter === 'incomplete'}
            onChange={(e) => e.target.checked && changeHandler('incomplete')}
          />
          {t('incomplete')}
        </label>
        <label className="flex gap-0.5 items-center">
          <input
            name="filter"
            type="radio"
            checked={filter === 'important'}
            onChange={(e) => e.target.checked && changeHandler('important')}
          />
          {t('important')}
        </label>
      </div>
    </>
  );
};

export default Filter;
