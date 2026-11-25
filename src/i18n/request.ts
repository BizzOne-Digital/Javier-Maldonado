import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { getMergedMessages } from "@/lib/site-content";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "en" | "es")) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: await getMergedMessages(locale as "en" | "es"),
  };
});
