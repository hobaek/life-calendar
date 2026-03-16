import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const supported = ["en", "ko", "ja", "zh", "es"];
  const raw = cookieStore.get("locale")?.value || "en";
  const locale = supported.includes(raw) ? raw : "en";
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
