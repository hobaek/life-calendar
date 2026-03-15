"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Subject, AvatarColor } from "@/lib/types";
import { AVATAR_COLORS, DEFAULT_EMOJIS } from "@/lib/constants";

interface Props {
  onSave: (subject: Subject) => void;
  onClose: () => void;
  subject?: Subject;
}

export default function SubjectFormModal({ onSave, onClose, subject }: Props) {
  const [name, setName] = useState(subject?.name ?? "");
  const [emoji, setEmoji] = useState(subject?.emoji ?? "👩");
  const [avatarColor, setAvatarColor] = useState<AvatarColor>(
    subject?.avatarColor ?? "coral",
  );
  const [birthDate, setBirthDate] = useState(subject?.birthDate ?? "");
  const [expectedLifespan, setExpectedLifespan] = useState(
    subject?.expectedLifespan?.toString() ?? "",
  );
  const [firstMetDate, setFirstMetDate] = useState(subject?.firstMetDate ?? "");
  const [freqType, setFreqType] = useState(
    subject?.meetingFrequency?.type ?? "",
  );
  const [freqCount, setFreqCount] = useState(
    subject?.meetingFrequency?.count?.toString() ?? "",
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const saved: Subject = {
      id: subject?.id ?? uuidv4(),
      name,
      emoji,
      avatarColor,
      birthDate,
      expectedLifespan: Number(expectedLifespan),
      firstMetDate: firstMetDate || undefined,
      meetingFrequency:
        freqType && freqCount
          ? {
              type: freqType as "weekly" | "monthly" | "yearly",
              count: Number(freqCount),
            }
          : undefined,
      createdAt: subject?.createdAt ?? new Date().toISOString().split("T")[0],
    };
    onSave(saved);
  }

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-card-bg rounded-card p-6 w-full max-w-md shadow-card-hover"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-serif text-xl font-semibold mb-4">
          {subject ? "Edit" : "Add someone"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-lc-text-light block mb-1">
              Emoji
            </label>
            <div className="flex gap-2 flex-wrap">
              {DEFAULT_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-10 h-10 rounded-full text-xl flex items-center justify-center transition-all ${
                    emoji === e
                      ? "bg-coral-light scale-110"
                      : "bg-empty hover:bg-coral-light/50"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-lc-text-light block mb-1">
              Color
            </label>
            <div className="flex gap-2">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setAvatarColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    c === "coral"
                      ? "bg-coral"
                      : c === "lavender"
                        ? "bg-lavender"
                        : "bg-mint"
                  } ${avatarColor === c ? "ring-2 ring-offset-2 ring-lc-text scale-110" : ""}`}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-lc-text-light block mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-light-gray bg-bg focus:outline-none focus:border-coral"
            />
          </div>
          <div>
            <label className="text-sm text-lc-text-light block mb-1">
              Birth date
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-light-gray bg-bg focus:outline-none focus:border-coral"
            />
          </div>
          <div>
            <label className="text-sm text-lc-text-light block mb-1">
              Expected lifespan (years)
            </label>
            <input
              type="number"
              value={expectedLifespan}
              onChange={(e) => setExpectedLifespan(e.target.value)}
              required
              min="1"
              max="150"
              className="w-full px-3 py-2 rounded-xl border border-light-gray bg-bg focus:outline-none focus:border-coral"
            />
          </div>
          <div>
            <label className="text-sm text-lc-text-light block mb-1">
              First met (optional)
            </label>
            <input
              type="date"
              value={firstMetDate}
              onChange={(e) => setFirstMetDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-light-gray bg-bg focus:outline-none focus:border-coral"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm text-lc-text-light block mb-1">
                How often you meet
              </label>
              <select
                value={freqType}
                onChange={(e) => setFreqType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-light-gray bg-bg focus:outline-none focus:border-coral"
              >
                <option value="">Not set</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-lc-text-light block mb-1">
                Times per period
              </label>
              <input
                type="number"
                value={freqCount}
                onChange={(e) => setFreqCount(e.target.value)}
                min="1"
                disabled={!freqType}
                className="w-full px-3 py-2 rounded-xl border border-light-gray bg-bg focus:outline-none focus:border-coral disabled:opacity-40"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-button text-lc-text-light font-semibold border border-light-gray hover:bg-empty transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-button bg-coral text-white font-semibold hover:opacity-90 transition-all"
            >
              {subject ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
