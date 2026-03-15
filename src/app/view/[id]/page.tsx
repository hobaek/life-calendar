"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Subject, GridUnit } from "@/lib/types";
import { getSubjects, decodeSubjectFromUrl } from "@/lib/storage";
import {
  getRemainingDays,
  getRemainingMeetups,
  getRemainingSeasons,
  getRemainingYears,
  getTimeRatio,
} from "@/lib/calculations";
import LifeGrid from "@/components/LifeGrid";
import UnitToggle from "@/components/UnitToggle";
import SeasonCounter from "@/components/SeasonCounter";
import TimeRatioBar from "@/components/TimeRatioBar";
import ShareButton from "@/components/ShareButton";

export default function DetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [unit, setUnit] = useState<GridUnit>("weeks");

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      const decoded = decodeSubjectFromUrl(data);
      if (decoded) { setSubject(decoded); return; }
    }
    const id = params.id as string;
    if (id) {
      const found = getSubjects().find((s) => s.id === id);
      if (found) { setSubject(found); return; }
    }
    router.push("/dashboard");
  }, [params.id, searchParams, router]);

  if (!subject) return null;

  const days = getRemainingDays(subject);
  const meetups = getRemainingMeetups(subject);
  const seasons = getRemainingSeasons(subject);
  const birthdays = getRemainingYears(subject);
  const ratio = getTimeRatio(subject);

  return (
    <main className="max-w-[900px] mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="w-10 h-10 rounded-full bg-card-bg shadow-card flex items-center justify-center text-xl hover:bg-empty transition-all"
        >
          ←
        </button>
        <div className="flex-1">
          <div className="font-serif text-[28px] font-bold">{subject.name}</div>
          <div className="text-sm text-lc-text-light">
            Born {new Date(subject.birthDate).toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric"
            })} · Expected lifespan: {subject.expectedLifespan} years
          </div>
        </div>
        <ShareButton subject={subject} />
      </div>

      {/* Exceeded lifespan warning */}
      {days === 0 && (
        <div className="bg-coral-light text-coral rounded-card px-6 py-4 mb-5 text-center font-serif font-semibold">
          Exceeded expected lifespan — every day is a gift
        </div>
      )}

      {/* Unit Toggle */}
      <div className="mb-5">
        <UnitToggle value={unit} onChange={setUnit} />
      </div>

      {/* Life Grid */}
      <div className="mb-5">
        <LifeGrid subject={subject} unit={unit} />
      </div>

      {/* Time Ratio */}
      <div className="mb-5">
        <TimeRatioBar ratio={ratio} />
      </div>

      {/* Season Counter */}
      <div className="mb-5">
        <SeasonCounter seasons={seasons} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card-bg rounded-card p-5 shadow-card">
          <div className="text-2xl mb-2">📅</div>
          <div className="font-serif text-[28px] font-bold text-coral">{days.toLocaleString()}</div>
          <div className="text-[13px] text-lc-text-light mt-1">Days remaining</div>
        </div>
        {meetups !== null && (
          <div className="bg-card-bg rounded-card p-5 shadow-card">
            <div className="text-2xl mb-2">🤝</div>
            <div className="font-serif text-[28px] font-bold text-coral">{meetups.toLocaleString()}</div>
            <div className="text-[13px] text-lc-text-light mt-1">Meetups remaining</div>
          </div>
        )}
        <div className="bg-card-bg rounded-card p-5 shadow-card">
          <div className="text-2xl mb-2">🎂</div>
          <div className="font-serif text-[28px] font-bold text-coral">{birthdays}</div>
          <div className="text-[13px] text-lc-text-light mt-1">Birthdays left</div>
        </div>
      </div>
    </main>
  );
}
