"use client";

import { GridUnit } from "@/lib/types";

const UNITS: { value: GridUnit; label: string }[] = [
  { value: "days", label: "Days" },
  { value: "weeks", label: "Weeks" },
  { value: "months", label: "Months" },
];

export default function UnitToggle({
  value,
  onChange,
}: {
  value: GridUnit;
  onChange: (unit: GridUnit) => void;
}) {
  return (
    <div className="flex gap-1 bg-card-bg rounded-xl p-1 shadow-card w-fit">
      {UNITS.map((unit) => (
        <button
          key={unit.value}
          onClick={() => onChange(unit.value)}
          className={`px-5 py-2 rounded-[10px] text-[13px] font-semibold transition-all ${
            value === unit.value
              ? "bg-coral text-white"
              : "text-lc-text-light hover:text-lc-text"
          }`}
        >
          {unit.label}
        </button>
      ))}
    </div>
  );
}
