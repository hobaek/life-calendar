"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Subject, GridUnit } from "@/lib/types";
import { getGridData } from "@/lib/calculations";

function GridCells({
  total,
  filled,
  todayIndex,
  columns,
  cellSize,
  gap,
}: {
  total: number;
  filled: number;
  todayIndex: number;
  columns: number;
  cellSize: number;
  gap: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
        gap: `${gap}px`,
        justifyContent: "center",
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
            style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
          />
        );
      })}
    </div>
  );
}

// Calculate how many columns fit in a given width
function calcColumns(
  containerWidth: number,
  cellSize: number,
  gap: number,
): number {
  if (containerWidth <= 0) return 52;
  return Math.floor((containerWidth + gap) / (cellSize + gap));
}

export default function LifeGrid({
  subject,
  unit,
}: {
  subject: Subject;
  unit: GridUnit;
}) {
  const t = useTranslations("detail");
  const tUnits = useTranslations("units");
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        // subtract padding (24px * 2 = 48px)
        setContainerWidth(containerRef.current.clientWidth - 48);
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const baseData = useMemo(() => getGridData(subject, unit), [subject, unit]);

  const unitKey = unit.slice(0, -1) as "day" | "week" | "month";

  // Cell and gap sizes per unit
  const cellSize = unit === "days" ? 4 : 10;
  const gap = unit === "days" ? 1 : 3;

  // Auto-fit columns to container width
  const columns =
    containerWidth > 0
      ? calcColumns(containerWidth, cellSize, gap)
      : baseData.columns;

  const legend = (
    <div className="text-[13px] text-lc-text-light mb-3">
      {t("grid_label", { unit: tUnits(unitKey) })} ·{" "}
      <span className="text-coral">■</span> {t("lived")}{" "}
      <span className="text-today">■</span> {t("today")}{" "}
      <span className="text-empty">■</span> {t("remaining")}
    </div>
  );

  // Fullscreen overlay
  if (expanded) {
    // In fullscreen, use larger cells
    const expandedCellSize = unit === "days" ? 5 : 12;
    const expandedGap = unit === "days" ? 1 : 3;

    return (
      <div className="fixed inset-0 z-50 bg-bg overflow-auto p-4 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          {legend}
          <button
            onClick={() => setExpanded(false)}
            className="px-4 py-2 rounded-button bg-coral text-white text-sm font-semibold hover:opacity-90 transition-all"
          >
            ✕ Close
          </button>
        </div>
        <GridCells
          total={baseData.total}
          filled={baseData.filled}
          todayIndex={baseData.todayIndex}
          columns={Math.floor(
            (window.innerWidth - 64 + expandedGap) /
              (expandedCellSize + expandedGap),
          )}
          cellSize={expandedCellSize}
          gap={expandedGap}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-card-bg rounded-card p-6 shadow-card">
      <div className="flex items-center justify-between">
        {legend}
        <button
          onClick={() => setExpanded(true)}
          className="text-lc-text-light hover:text-coral text-sm font-semibold transition-all flex items-center gap-1 shrink-0"
        >
          ⛶ Expand
        </button>
      </div>
      {containerWidth > 0 && (
        <GridCells
          total={baseData.total}
          filled={baseData.filled}
          todayIndex={baseData.todayIndex}
          columns={columns}
          cellSize={cellSize}
          gap={gap}
        />
      )}
    </div>
  );
}
