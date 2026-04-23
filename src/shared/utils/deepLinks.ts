import { APP_PUBLIC_URL } from '../constants/legal';

const LEGAL_ROUTE_SET = new Set(['/privacy', '/terms']);
const APP_URL_ORIGIN = new URL(APP_PUBLIC_URL).origin.toLowerCase();

const normalizePath = (path: string) => {
  if (!path) {
    return '/';
  }

  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  const withoutTrailingSlash =
    withLeadingSlash.length > 1
      ? withLeadingSlash.replace(/\/+$/, '')
      : withLeadingSlash;

  return withoutTrailingSlash.toLowerCase();
};

export const getAppRouteFromUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const isAppScheme = parsedUrl.protocol === 'com.tandem.app:';
    const isConfiguredWebOrigin =
      parsedUrl.protocol === 'https:' &&
      parsedUrl.origin.toLowerCase() === APP_URL_ORIGIN;

    if (!isAppScheme && !isConfiguredWebOrigin) {
      return null;
    }

    const candidatePath = isAppScheme
      ? `${parsedUrl.hostname ? `/${parsedUrl.hostname}` : ''}${parsedUrl.pathname === '/' ? '' : parsedUrl.pathname}`
      : parsedUrl.pathname;
    const normalizedPath = normalizePath(candidatePath);

    return LEGAL_ROUTE_SET.has(normalizedPath) ? normalizedPath : null;
  } catch {
    return null;
  }
};
