import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

export default function Sidebar() {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Drawer direction={`${locale === 'fa' ? 'right' : 'left'}`}>
      <DrawerTrigger>
        <HamburgerMenuIcon width={40} height={40} />
      </DrawerTrigger>
      <DrawerContent className="h-full w-[300px]">
        <div className="flex flex-col items-center pt-20 gap-5 text-xl">
          <DrawerClose className="w-full">
            <button
              className="hover:text-black hover:bg-gray-200 block w-full p-2 text-center"
              onClick={() => router.push('/')}
            >
              {t('home')}
            </button>
          </DrawerClose>
          <DrawerClose className="w-full">
            <button
              className="hover:text-black hover:bg-gray-200 block w-full p-2 text-center"
              onClick={() => router.push(`/${locale}/articles`)}
            >
              {t('articles')}
            </button>
          </DrawerClose>
          <DrawerClose className="w-full">
            <button
              className="hover:text-black hover:bg-gray-200 block w-full p-2 text-center"
              onClick={() => router.push(`/${locale}/todo`)}
            >
              {t('todo-list')}
            </button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
