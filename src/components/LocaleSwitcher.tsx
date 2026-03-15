"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  function switchLocale() {
    const next = locale === "en" ? "ko" : "en";
    document.cookie = `locale=${next};path=/;max-age=31536000`;
    router.refresh();
  }

  return (
    <button
      onClick={switchLocale}
      className="px-3 py-1.5 rounded-full bg-card-bg shadow-card text-sm font-semibold text-lc-text-light hover:text-coral transition-all"
    >
      {locale === "en" ? "한국어" : "EN"}
    </button>
  );
}
