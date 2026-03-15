"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { UserProfile } from "@/lib/types";

interface Props {
  profile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
}

export default function UserProfileSetup({ profile, onSave }: Props) {
  const t = useTranslations("profile");
  const [editing, setEditing] = useState(!profile);
  const [birthDate, setBirthDate] = useState(profile?.birthDate ?? "");
  const [expectedLifespan, setExpectedLifespan] = useState(
    profile?.expectedLifespan?.toString() ?? "80",
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ birthDate, expectedLifespan: Number(expectedLifespan) });
    setEditing(false);
  }

  // Onboarding prompt — no profile set yet
  if (!profile && !editing) {
    return null;
  }

  // Show compact display when profile exists and not editing
  if (profile && !editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-card bg-card-bg shadow-card text-sm text-lc-text-light hover:text-coral transition-all"
      >
        <span>👤</span>
        <span>
          {t("your_info")}: {new Date(profile.birthDate).getFullYear()},{" "}
          {profile.expectedLifespan}
          {t("years_short")}
        </span>
        <span className="text-xs">✏️</span>
      </button>
    );
  }

  // Edit / onboarding form
  return (
    <div className="bg-card-bg rounded-card p-5 shadow-card mb-6">
      <h3 className="font-serif text-lg font-semibold mb-1">{t("title")}</h3>
      <p className="text-sm text-lc-text-light mb-4">{t("description")}</p>
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <div>
          <label className="text-sm text-lc-text-light block mb-1">
            {t("birth_date")}
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
            className="px-3 py-2 rounded-xl border border-light-gray bg-bg focus:outline-none focus:border-coral text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-lc-text-light block mb-1">
            {t("lifespan")}
          </label>
          <input
            type="number"
            value={expectedLifespan}
            onChange={(e) => setExpectedLifespan(e.target.value)}
            required
            min="1"
            max="150"
            className="w-20 px-3 py-2 rounded-xl border border-light-gray bg-bg focus:outline-none focus:border-coral text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2 rounded-button bg-coral text-white text-sm font-semibold hover:opacity-90 transition-all"
        >
          {t("save")}
        </button>
        {profile && (
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="px-4 py-2 text-sm text-lc-text-light hover:text-coral transition-all"
          >
            {t("cancel")}
          </button>
        )}
      </form>
    </div>
  );
}
