"use client";

import { useTranslations } from "next-intl";

interface Props {
  ratio: number;
}

export default function TimeRatioBar({ ratio }: Props) {
  const t = useTranslations("detail");
  const percent = Math.round(ratio * 100);

  return (
    <div className="bg-card-bg rounded-card p-5 shadow-card">
      <div className="font-serif text-base font-semibold mb-3">
        {t("ratio_title")}
      </div>
      <div className="h-4 bg-empty rounded-lg overflow-hidden mb-2">
        <div
          className="h-full rounded-lg bg-gradient-to-r from-coral to-filled-alt transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-lc-text-light">
        <span>{t("ratio_passed", { percent })}</span>
        <span>{t("ratio_remaining", { percent: 100 - percent })}</span>
      </div>
    </div>
  );
}
