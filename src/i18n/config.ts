export const locales = ["en", "hi"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "hi";

export function isSupportedLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
