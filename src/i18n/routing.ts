import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['tr', 'en'],

    // Used when no locale matches
    defaultLocale: 'tr',

    // Use a prefix for all locales including default
    localePrefix: 'as-needed'
});

export type Locale = (typeof routing.locales)[number];

export function isValidLocale(locale: string): locale is Locale {
    return routing.locales.includes(locale as Locale);
}

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
