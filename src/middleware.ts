import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

export default function chainedMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const localeInPath = pathname.startsWith('/fa') || pathname.startsWith('/en');

  const localeCookie = req.cookies.get('NEXT_LOCALE');

  if (!localeCookie && !localeInPath) {
    const res = NextResponse.next();
    res.cookies.set('NEXT_LOCALE', 'fa', {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });

    const redirectUrl = new URL(`/fa${pathname}`, req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return createMiddleware({
    locales: ['fa', 'en'],
    defaultLocale: 'fa',
  })(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(fa|en)/:path*'],
};
