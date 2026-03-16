import { Subject, UserProfile } from "./types";
import { STORAGE_KEY, PROFILE_STORAGE_KEY } from "./constants";

export function getSubjects(): Subject[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSubjects(subjects: Subject[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
}

export function addSubject(subject: Subject): void {
  const subjects = getSubjects();
  subjects.push(subject);
  saveSubjects(subjects);
}

export function updateSubject(updated: Subject): void {
  const subjects = getSubjects().map((s) =>
    s.id === updated.id ? updated : s,
  );
  saveSubjects(subjects);
}

export function deleteSubject(id: string): void {
  const subjects = getSubjects().filter((s) => s.id !== id);
  saveSubjects(subjects);
}

export function getUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function encodeSubjectForUrl(subject: Subject): string {
  return btoa(encodeURIComponent(JSON.stringify(subject)));
}

export function decodeSubjectFromUrl(encoded: string): Subject | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(atob(encoded)));
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.id === "string" &&
      typeof parsed.name === "string" &&
      typeof parsed.birthDate === "string" &&
      typeof parsed.expectedLifespan === "number"
    ) {
      return parsed as Subject;
    }
    return null;
  } catch {
    return null;
  }
}
