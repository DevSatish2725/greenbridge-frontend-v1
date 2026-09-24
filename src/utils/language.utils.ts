import type { Locale } from "@/i18n/config";

export const LANGUAGE_STORAGE_KEY = "greenbridge-language";

export const LANGUAGE_COOKIE_KEY = "GREENBRIDGE_LOCALE";

export const setClientLanguage = (locale: Locale) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);

  document.cookie =
    `${LANGUAGE_COOKIE_KEY}=${locale}; ` +
    "path=/; max-age=31536000; SameSite=Lax";
};
