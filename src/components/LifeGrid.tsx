"use client";

import { useMemo } from "react";
import { Subject, GridUnit } from "@/lib/types";
import { getGridData } from "@/lib/calculations";

export default function LifeGrid({
  subject,
  unit,
}: {
  subject: Subject;
  unit: GridUnit;
}) {
  const { total, filled, todayIndex, columns } = useMemo(
    () => getGridData(subject, unit),
    [subject, unit],
  );

  return (
    <div className="bg-card-bg rounded-card p-6 shadow-card">
      <div className="text-[13px] text-lc-text-light mb-3">
        Each square = 1 {unit.slice(0, -1)} ·{" "}
        <span className="text-coral">■</span> lived{" "}
        <span className="text-today">■</span> today{" "}
        <span className="text-empty">■</span> remaining
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
