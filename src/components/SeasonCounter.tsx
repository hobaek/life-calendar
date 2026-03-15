"use client";

import { useTranslations } from "next-intl";

interface Props {
  seasons: { spring: number; summer: number; autumn: number; winter: number };
}

const SEASON_CONFIG = [
  { key: "spring" as const, icon: "🌸", labelKey: "springs" },
  { key: "summer" as const, icon: "☀️", labelKey: "summers" },
  { key: "autumn" as const, icon: "🍁", labelKey: "autumns" },
  { key: "winter" as const, icon: "❄️", labelKey: "winters" },
];

export default function SeasonCounter({ seasons }: Props) {
  const t = useTranslations("detail");

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {SEASON_CONFIG.map(({ key, icon, labelKey }) => (
        <div
          key={key}
          className="bg-card-bg rounded-card p-4 shadow-card text-center"
        >
          <div className="text-[28px] mb-1">{icon}</div>
          <div className="font-serif text-2xl font-bold">{seasons[key]}</div>
          <div className="text-[11px] text-lc-text-light">{t(labelKey)}</div>
        </div>
      ))}
    </div>
  );
}
