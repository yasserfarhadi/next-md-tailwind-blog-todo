import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/context/ThemeProvider';
import { LaptopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useLocale, useTranslations } from 'next-intl';

const Theme = () => {
  const { changeTheme, mode } = useTheme();
  const t = useTranslations('Theme');
  const locale = useLocale();
  return (
    <DropdownMenu dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <DropdownMenuTrigger className="bg-transparent text-foreground">
        {mode === 'dark' ? <MoonIcon /> : <SunIcon />}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={() => changeTheme('light')}
        >
          <SunIcon /> {t('light')}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={() => changeTheme('dark')}
        >
          <MoonIcon /> {t('dark')}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={() => changeTheme('system')}
        >
          <LaptopIcon /> {t('system')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Theme;
