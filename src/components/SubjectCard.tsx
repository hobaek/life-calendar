"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Subject } from "@/lib/types";
import { getRemainingWeeks, getRemainingYears } from "@/lib/calculations";
import { AVATAR_COLOR_MAP } from "@/lib/constants";
import MiniGrid from "./MiniGrid";

export default function SubjectCard({ subject }: { subject: Subject }) {
  const t = useTranslations("card");
  const weeks = getRemainingWeeks(subject);
  const years = getRemainingYears(subject);
  const colorCfg = AVATAR_COLOR_MAP[subject.avatarColor];

  return (
    <Link href={`/view/${subject.id}`}>
      <div className="bg-card-bg rounded-card p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all cursor-pointer">
        <div className="flex items-center gap-3 mb-3.5">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center text-[22px] ${colorCfg.bg}`}
          >
            {subject.emoji}
          </div>
          <div>
            <div className="font-serif text-lg font-semibold">
              {subject.name}
            </div>
            <div className="text-[13px] text-lc-text-light">
              {t("born", {
                year: new Date(subject.birthDate).getFullYear(),
                lifespan: subject.expectedLifespan,
              })}
            </div>
          </div>
        </div>
        <div className="flex gap-4 mb-3.5">
          <div>
            <div className="text-2xl font-bold text-coral">
              {weeks.toLocaleString()}
            </div>
            <div className="text-xs text-lc-text-light">{t("weeks_left")}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-coral">{years}</div>
            <div className="text-xs text-lc-text-light">{t("years_left")}</div>
          </div>
        </div>
        <MiniGrid subject={subject} />
      </div>
    </Link>
  );
}
