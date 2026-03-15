"use client";

import { Subject } from "@/lib/types";
import { getTimeRatio } from "@/lib/calculations";

export default function MiniGrid({ subject }: { subject: Subject }) {
  const ratio = getTimeRatio(subject);
  const total = 80;
  const filled = Math.floor(total * ratio);

  return (
    <div className="flex flex-wrap gap-[2px]">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-[1.5px] ${
            i < filled
              ? "bg-filled-alt"
              : i === filled
                ? "bg-today"
                : "bg-empty"
          }`}
        />
      ))}
    </div>
  );
}
