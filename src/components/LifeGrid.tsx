"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Subject, GridUnit } from "@/lib/types";
import { getGridData } from "@/lib/calculations";

export default function LifeGrid({
  subject,
  unit,
}: {
  subject: Subject;
  unit: GridUnit;
}) {
  const t = useTranslations("detail");
  const tUnits = useTranslations("units");
  const { total, filled, todayIndex, columns } = useMemo(
    () => getGridData(subject, unit),
    [subject, unit],
  );

  // Map GridUnit ("days" | "weeks" | "months") to singular unit translation key
  const unitKey = unit.slice(0, -1) as "day" | "week" | "month";

  return (
    <div className="bg-card-bg rounded-card p-6 shadow-card">
      <div className="text-[13px] text-lc-text-light mb-3">
        {t("grid_label", { unit: tUnits(unitKey) })} ·{" "}
        <span className="text-coral">■</span> {t("lived")}{" "}
        <span className="text-today">■</span> {t("today")}{" "}
        <span className="text-empty">■</span> {t("remaining")}
      </div>
      <div
        className="grid gap-[3px]"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          contain: "strict",
        }}
      >
        {Array.from({ length: total }, (_, i) => {
          let cls = "bg-empty";
          if (i < filled) {
            cls = i % 2 === 0 ? "bg-coral" : "bg-filled-alt";
          } else if (i === todayIndex) {
            cls = "bg-today animate-pulse-today";
          }
          return (
            <div
              key={i}
              className={`aspect-square rounded-cell ${cls} ${
                unit === "days" ? "w-[3px] sm:w-[5px]" : "w-[7px] sm:w-[10px]"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
