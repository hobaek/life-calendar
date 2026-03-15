"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Subject } from "@/lib/types";
import { getSubjects, addSubject, updateSubject, deleteSubject } from "@/lib/storage";
import SubjectCard from "@/components/SubjectCard";
import SubjectFormModal from "@/components/SubjectFormModal";
import DailyReminder from "@/components/DailyReminder";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSubjects(getSubjects());
    setLoaded(true);
  }, []);

  function handleSave(subject: Subject) {
    if (editingSubject) {
      updateSubject(subject);
    } else {
      addSubject(subject);
    }
    setSubjects(getSubjects());
    setShowModal(false);
    setEditingSubject(undefined);
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

  return (
    <main className="max-w-[900px] mx-auto p-6">
      <DailyReminder subjects={subjects} />

      {subjects.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">💛</div>
          <h2 className="font-serif text-2xl font-semibold mb-2">{t("empty_title")}</h2>
          <p className="text-lc-text-light mb-6">{t("empty_description")}</p>
          <button onClick={() => setShowModal(true)}
            className="px-8 py-3 bg-coral text-white rounded-button font-bold hover:opacity-90 transition-all">
            {t("add")}
          </button>
        </div>
      )}

      {subjects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
          {subjects.map((s) => (
            <div key={s.id} className="relative group">
              <SubjectCard subject={s} />
              <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                <button onClick={(e) => { e.preventDefault(); handleEdit(s); }}
                  className="w-8 h-8 rounded-full bg-card-bg shadow-card text-sm flex items-center justify-center hover:bg-empty">✏️</button>
                <button onClick={(e) => { e.preventDefault(); handleDelete(s.id); }}
                  className="w-8 h-8 rounded-full bg-card-bg shadow-card text-sm flex items-center justify-center hover:bg-empty">🗑</button>
              </div>
            </div>
          ))}
          <button onClick={() => { setEditingSubject(undefined); setShowModal(true); }}
            className="bg-card-bg rounded-card p-5 shadow-card border-2 border-dashed border-light-gray flex flex-col items-center justify-center min-h-[180px] text-lc-text-light hover:border-coral hover:text-coral transition-all">
            <div className="text-4xl mb-2">+</div>
            <div className="text-sm font-semibold">{t("add")}</div>
          </button>
        </div>
      )}

      {showModal && (
        <SubjectFormModal
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingSubject(undefined); }}
          subject={editingSubject}
        />
      )}
    </main>
  );
}
