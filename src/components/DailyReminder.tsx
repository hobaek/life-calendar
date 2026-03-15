"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Subject, UserProfile } from "@/lib/types";
import { getRemainingWeeks } from "@/lib/calculations";

export default function DailyReminder({
  subjects,
  userProfile,
}: {
  subjects: Subject[];
  userProfile?: UserProfile | null;
}) {
  const t = useTranslations("dashboard");

  const reminder = useMemo(() => {
    if (subjects.length === 0) return null;
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const subject = subjects[dayOfYear % subjects.length];
    const weeks = getRemainingWeeks(subject, userProfile);
    return { name: subject.name, weeks };
  }, [subjects, userProfile]);

  if (!reminder) return null;

  return (
    <div className="bg-gradient-to-br from-coral-light to-lavender-light rounded-card px-6 py-5 mb-7 text-center">
      <div className="text-[13px] text-lc-text-light uppercase tracking-wider mb-1">
        {t("reminder_label")}
      </div>
      <div className="font-serif text-[22px] font-semibold">
        {t("reminder_message", {
          weeks: reminder.weeks.toLocaleString(),
          name: reminder.name,
        })}
      </div>
    </div>
  );
}
