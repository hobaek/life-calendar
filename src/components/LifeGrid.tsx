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

  const cellSize = unit === "days" ? 3 : 10;
  const cellSizeSm = unit === "days" ? 2 : 7;
  const gap = unit === "days" ? 1 : 3;

  return (
    <div className="bg-card-bg rounded-card p-6 shadow-card overflow-x-auto">
      <div className="text-[13px] text-lc-text-light mb-3">
        {t("grid_label", { unit: tUnits(unitKey) })} ·{" "}
        <span className="text-coral">■</span> {t("lived")}{" "}
        <span className="text-today">■</span> {t("today")}{" "}
        <span className="text-empty">■</span> {t("remaining")}
      </div>
      <div
        className="inline-grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, ${cellSizeSm}px)`,
          gap: `${gap}px`,
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
              className={`rounded-cell ${cls}`}
              style={{
                width: `${cellSizeSm}px`,
                height: `${cellSizeSm}px`,
              }}
            />
          );
        })}
      </div>
      <style jsx>{`
        @media (min-width: 640px) {
          .inline-grid {
            grid-template-columns: repeat(${columns}, ${cellSize}px) !important;
          }
          .inline-grid > div {
            width: ${cellSize}px !important;
            height: ${cellSize}px !important;
          }
        }
      `}</style>
    </div>
  );
}
