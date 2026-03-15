"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Subject, UserProfile } from "@/lib/types";
import {
  getSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
  getUserProfile,
  saveUserProfile,
} from "@/lib/storage";
import SubjectCard from "@/components/SubjectCard";
import SubjectFormModal from "@/components/SubjectFormModal";
import DailyReminder from "@/components/DailyReminder";
import UserProfileSetup from "@/components/UserProfileSetup";

const ME_SUBJECT_ID = "me";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>();
  const [loaded, setLoaded] = useState(false);
  // Onboarding: step 1 = profile, step 2 = add first subject
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | null>(null);

  useEffect(() => {
    const profile = getUserProfile();
    const subs = getSubjects();
    setUserProfile(profile);
    setSubjects(subs);
    setLoaded(true);

    // Determine onboarding state
    if (!profile) {
      setOnboardingStep(1);
    } else if (subs.filter((s) => s.id !== ME_SUBJECT_ID).length === 0) {
      setOnboardingStep(2);
    }
  }, []);

  function handleProfileSave(profile: UserProfile) {
    saveUserProfile(profile);
    setUserProfile(profile);

    // Auto-create or update "Me" subject
    const existing = getSubjects().find((s) => s.id === ME_SUBJECT_ID);
    const meSubject: Subject = {
      id: ME_SUBJECT_ID,
      name: "Me",
      emoji: "🪞",
      avatarColor: "lavender",
      birthDate: profile.birthDate,
      expectedLifespan: profile.expectedLifespan,
      createdAt: existing?.createdAt ?? new Date().toISOString().split("T")[0],
    };
    if (existing) {
      updateSubject(meSubject);
    } else {
      addSubject(meSubject);
    }
    setSubjects(getSubjects());
    setOnboardingStep(2);
  }

  function handleSave(subject: Subject) {
    if (editingSubject) {
      updateSubject(subject);
    } else {
      addSubject(subject);
    }
    setSubjects(getSubjects());
    setShowModal(false);
    setEditingSubject(undefined);
    setOnboardingStep(null);
  }

  function handleEdit(subject: Subject) {
    setEditingSubject(subject);
    setShowModal(true);
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to remove this?")) {
      deleteSubject(id);
      setSubjects(getSubjects());
    }
  }

  if (!loaded) return null;

  // === ONBOARDING STEP 1: Profile setup ===
  if (onboardingStep === 1) {
    return (
      <main className="max-w-[500px] mx-auto p-6 min-h-screen flex flex-col items-center justify-center">
        <div className="text-5xl mb-6">⏳</div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-2">
          {t("onboarding_title")}
        </h1>
        <p className="text-lc-text-light text-center mb-8">
          {t("onboarding_description")}
        </p>
        <div className="w-full">
          <UserProfileSetup profile={null} onSave={handleProfileSave} />
        </div>
        <div className="flex gap-2 mt-6">
          <div className="w-8 h-2 rounded-full bg-coral" />
          <div className="w-8 h-2 rounded-full bg-light-gray" />
        </div>
      </main>
    );
  }

  // === ONBOARDING STEP 2: Add first subject ===
  if (onboardingStep === 2) {
    return (
      <main className="max-w-[500px] mx-auto p-6 min-h-screen flex flex-col items-center justify-center">
        <div className="text-5xl mb-6">💛</div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-2">
          {t("onboarding_step2_title")}
        </h1>
        <p className="text-lc-text-light text-center mb-8">
          {t("onboarding_step2_description")}
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="px-8 py-3 bg-coral text-white rounded-button font-bold text-lg hover:opacity-90 transition-all"
        >
          {t("add")}
        </button>
        <div className="flex gap-2 mt-6">
          <div className="w-8 h-2 rounded-full bg-coral" />
          <div className="w-8 h-2 rounded-full bg-coral" />
        </div>
        {showModal && (
          <SubjectFormModal
            onSave={handleSave}
            onClose={() => setShowModal(false)}
          />
        )}
      </main>
    );
  }

  // === NORMAL DASHBOARD ===
  // Filter out "Me" subject from non-me count for empty check
  const nonMeSubjects = subjects.filter((s) => s.id !== ME_SUBJECT_ID);

  return (
    <main className="max-w-[900px] mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <UserProfileSetup profile={userProfile} onSave={handleProfileSave} />
      </div>
      <DailyReminder subjects={nonMeSubjects} userProfile={userProfile} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        {subjects.map((s) => (
          <div key={s.id} className="relative group">
            <SubjectCard subject={s} userProfile={userProfile} />
            {s.id !== ME_SUBJECT_ID && (
              <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleEdit(s);
                  }}
                  className="w-8 h-8 rounded-full bg-card-bg shadow-card text-sm flex items-center justify-center hover:bg-empty"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(s.id);
                  }}
                  className="w-8 h-8 rounded-full bg-card-bg shadow-card text-sm flex items-center justify-center hover:bg-empty"
                >
                  🗑
                </button>
              </div>
            )}
          </div>
        ))}
        <button
          onClick={() => {
            setEditingSubject(undefined);
            setShowModal(true);
          }}
          className="bg-card-bg rounded-card p-5 shadow-card border-2 border-dashed border-light-gray flex flex-col items-center justify-center min-h-[180px] text-lc-text-light hover:border-coral hover:text-coral transition-all"
        >
          <div className="text-4xl mb-2">+</div>
          <div className="text-sm font-semibold">{t("add")}</div>
        </button>
      </div>

      {showModal && (
        <SubjectFormModal
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingSubject(undefined);
          }}
          subject={editingSubject}
        />
      )}
    </main>
  );
}
