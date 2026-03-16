"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "ko", label: "한국어" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
  { code: "es", label: "Español" },
] as const;

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    document.cookie = `locale=${e.target.value};path=/;max-age=31536000`;
    router.refresh();
  }

  return (
    <select
      value={locale}
      onChange={handleChange}
      className="px-3 py-1.5 rounded-full bg-card-bg shadow-card text-sm font-semibold text-lc-text-light hover:text-coral transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-coral appearance-none pr-6"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238A7E7E' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
      }}
    >
      {LOCALES.map(({ code, label }) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  );
}
