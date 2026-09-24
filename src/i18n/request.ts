import {
  getRequestConfig,
} from "next-intl/server";

import { cookies } from "next/headers";

import {
  defaultLocale,
  isSupportedLocale,
} from "./config";

export default getRequestConfig(
  async () => {
    const cookieStore =
      await cookies();

    const savedLocale =
      cookieStore.get(
        "GREENBRIDGE_LOCALE",
      )?.value;

    const locale =
      savedLocale &&
      isSupportedLocale(savedLocale)
        ? savedLocale
        : defaultLocale;

    return {
      locale,

      messages: (
        await import(
          `../../messages/${locale}.json`
        )
      ).default,

      timeZone: "Asia/Kolkata",
    };
  },
);