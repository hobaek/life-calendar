"use client";

import { useMemo } from "react";
import { Subject } from "@/lib/types";
import { getRemainingWeeks } from "@/lib/calculations";

export default function DailyReminder({ subjects }: { subjects: Subject[] }) {
  const reminder = useMemo(() => {
    if (subjects.length === 0) return null;
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const subject = subjects[dayOfYear % subjects.length];
    const weeks = getRemainingWeeks(subject);
    return { name: subject.name, weeks };
  }, [subjects]);

  if (!reminder) return null;

  return (
    <div className="bg-gradient-to-br from-coral-light to-lavender-light rounded-card px-6 py-5 mb-7 text-center">
      <div className="text-[13px] text-lc-text-light uppercase tracking-wider mb-1">
        Today&apos;s Reminder
      </div>
      <div className="font-serif text-[22px] font-semibold">
        You have{" "}
        <span className="text-coral text-[28px] font-bold">
          {reminder.weeks.toLocaleString()}
        </span>{" "}
        Saturdays left with {reminder.name}
      </div>
    </div>
  );
}
