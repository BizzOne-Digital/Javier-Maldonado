import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// NOTE: keep this file free of database imports. next-intl bundles it into the
// edge middleware. Admin content overrides are merged in [locale]/layout.tsx.
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "en" | "es")) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
