import { Subject, GridUnit, UserProfile } from "./types";

function getSubjectEndDate(subject: Subject): Date {
  const birth = new Date(subject.birthDate);
  return new Date(
    birth.getFullYear() + subject.expectedLifespan,
    birth.getMonth(),
    birth.getDate(),
  );
}

function getUserEndDate(profile: UserProfile): Date {
  const birth = new Date(profile.birthDate);
  return new Date(
    birth.getFullYear() + profile.expectedLifespan,
    birth.getMonth(),
    birth.getDate(),
  );
}

// The effective end date is the earlier of subject's end or user's end
function getEndDate(subject: Subject, userProfile?: UserProfile | null): Date {
  const subjectEnd = getSubjectEndDate(subject);
  if (!userProfile) return subjectEnd;
  const userEnd = getUserEndDate(userProfile);
  return subjectEnd < userEnd ? subjectEnd : userEnd;
}

export function getRemainingDays(
  subject: Subject,
  userProfile?: UserProfile | null,
): number {
  const end = getEndDate(subject, userProfile);
  const today = new Date();
  const diff = end.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getRemainingWeeks(
  subject: Subject,
  userProfile?: UserProfile | null,
): number {
  return Math.floor(getRemainingDays(subject, userProfile) / 7);
}

export function getRemainingMonths(
  subject: Subject,
  userProfile?: UserProfile | null,
): number {
  const end = getEndDate(subject, userProfile);
  const today = new Date();
  if (end <= today) return 0;
  return (
    (end.getFullYear() - today.getFullYear()) * 12 +
    (end.getMonth() - today.getMonth())
  );
}

export function getRemainingYears(
  subject: Subject,
  userProfile?: UserProfile | null,
): number {
  const end = getEndDate(subject, userProfile);
  const today = new Date();
  if (end <= today) return 0;
  let years = end.getFullYear() - today.getFullYear();
  const monthDiff = end.getMonth() - today.getMonth();
  const dayDiff = end.getDate() - today.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    years--;
  }
  return Math.max(0, years);
}

export function getRemainingMeetups(
  subject: Subject,
  userProfile?: UserProfile | null,
): number | null {
  if (!subject.meetingFrequency) return null;
  const { type, count } = subject.meetingFrequency;
  switch (type) {
    case "weekly":
      return count * getRemainingWeeks(subject, userProfile);
    case "monthly":
      return count * getRemainingMonths(subject, userProfile);
    case "yearly":
      return count * getRemainingYears(subject, userProfile);
  }
}

export function getRemainingSeasons(
  subject: Subject,
  userProfile?: UserProfile | null,
): {
  spring: number;
  summer: number;
  autumn: number;
  winter: number;
} {
  const years = getRemainingYears(subject, userProfile);
  return { spring: years, summer: years, autumn: years, winter: years };
}

export function getTimeRatio(
  subject: Subject,
  userProfile?: UserProfile | null,
): number {
  const startDate = new Date(subject.firstMetDate ?? subject.birthDate);
  const endDate = getEndDate(subject, userProfile);
  const today = new Date();
  const totalSpan = endDate.getTime() - startDate.getTime();
  if (totalSpan <= 0) return 1;
  const elapsed = today.getTime() - startDate.getTime();
  return Math.min(1, Math.max(0, elapsed / totalSpan));
}

function getAgeInUnit(subject: Subject, unit: GridUnit): number {
  const birth = new Date(subject.birthDate);
  const today = new Date();
  const diffMs = today.getTime() - birth.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  switch (unit) {
    case "days":
      return diffDays;
    case "weeks":
      return Math.floor(diffDays / 7);
    case "months":
      return (
        (today.getFullYear() - birth.getFullYear()) * 12 +
        (today.getMonth() - birth.getMonth())
      );
  }
}

const UNIT_MULTIPLIER: Record<GridUnit, number> = {
  days: 365,
  weeks: 52,
  months: 12,
};
const UNIT_COLUMNS: Record<GridUnit, number> = {
  days: 52,
  weeks: 52,
  months: 12,
};

export function getGridData(subject: Subject, unit: GridUnit) {
  const total = subject.expectedLifespan * UNIT_MULTIPLIER[unit];
  const filled = Math.min(getAgeInUnit(subject, unit), total);
  return {
    total,
    filled,
    todayIndex: filled,
    columns: UNIT_COLUMNS[unit],
  };
}
