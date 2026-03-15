import Link from "next/link";
import { useTranslations } from "next-intl";

export default function LandingPage() {
  const t = useTranslations("landing");

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-5 py-10 text-center">
      <div className="text-6xl mb-6">⏳</div>
      <h1 className="font-serif text-3xl sm:text-[42px] font-bold leading-tight mb-4">
        {t("title")}
      </h1>
      <p className="text-lg text-lc-text-light max-w-[480px] leading-relaxed mb-10">
        {t("description")}
      </p>
      <Link
        href="/dashboard"
        className="px-10 py-4 bg-coral text-white rounded-button text-lg font-bold shadow-[0_4px_16px_rgba(244,132,95,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(244,132,95,0.4)] transition-all"
      >
        {t("cta")}
      </Link>
    </main>
  );
}
