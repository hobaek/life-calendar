import { describe, it, expect, vi } from "vitest";
import {
  getRemainingDays,
  getRemainingWeeks,
  getRemainingMonths,
  getRemainingMeetups,
  getRemainingSeasons,
  getTimeRatio,
  getGridData,
} from "@/lib/calculations";
import { Subject } from "@/lib/types";

const mockSubject: Subject = {
  id: "test-1",
  name: "Mom",
  emoji: "👩",
  avatarColor: "coral",
  birthDate: "1960-03-15",
  expectedLifespan: 85,
  createdAt: "2026-03-15",
};

describe("getRemainingDays", () => {
  it("calculates remaining days from birth date and lifespan", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    const result = getRemainingDays(mockSubject);
    expect(result).toBeGreaterThan(6900);
    expect(result).toBeLessThan(7000);
    vi.useRealTimers();
  });

  it("returns 0 when lifespan is exceeded", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2050-01-01"));
    const result = getRemainingDays(mockSubject);
    expect(result).toBe(0);
    vi.useRealTimers();
  });
});

describe("getRemainingWeeks", () => {
  it("returns remaining days divided by 7", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    const result = getRemainingWeeks(mockSubject);
    expect(result).toBeGreaterThan(990);
    expect(result).toBeLessThan(1000);
    vi.useRealTimers();
  });
});

describe("getRemainingMonths", () => {
  it("uses calendar month difference, not days/30.44", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    const result = getRemainingMonths(mockSubject);
    expect(result).toBe(228);
    vi.useRealTimers();
  });
});

describe("getRemainingMeetups", () => {
  it("calculates weekly meetups", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    const subject = {
      ...mockSubject,
      meetingFrequency: { type: "weekly" as const, count: 1 },
    };
    const result = getRemainingMeetups(subject);
    expect(result).toBeGreaterThan(990);
    vi.useRealTimers();
  });

  it("returns null when no meeting frequency", () => {
    const result = getRemainingMeetups(mockSubject);
    expect(result).toBeNull();
  });
});

describe("getRemainingSeasons", () => {
  it("returns seasons based on remaining years", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    const result = getRemainingSeasons(mockSubject);
    expect(result).toEqual({ spring: 19, summer: 19, autumn: 19, winter: 19 });
    vi.useRealTimers();
  });
});

describe("getTimeRatio", () => {
  it("calculates ratio using firstMetDate", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    const subject = { ...mockSubject, firstMetDate: "1990-01-01" };
    const result = getTimeRatio(subject);
    expect(result).toBeGreaterThan(0.6);
    expect(result).toBeLessThan(0.7);
    vi.useRealTimers();
  });

  it("defaults to birthDate when firstMetDate not set", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    const result = getTimeRatio(mockSubject);
    expect(result).toBeCloseTo(0.776, 1);
    vi.useRealTimers();
  });
});

describe("getGridData", () => {
  it("returns correct grid for weeks unit", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    const result = getGridData(mockSubject, "weeks");
    expect(result.total).toBe(85 * 52);
    expect(result.filled).toBeGreaterThan(3400);
    expect(result.todayIndex).toBe(result.filled);
    expect(result.columns).toBe(52);
    vi.useRealTimers();
  });

  it("returns correct grid for months unit", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    const result = getGridData(mockSubject, "months");
    expect(result.total).toBe(85 * 12);
    expect(result.columns).toBe(12);
    vi.useRealTimers();
  });

  it("returns correct grid for days unit", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    const result = getGridData(mockSubject, "days");
    expect(result.total).toBe(85 * 365);
    expect(result.columns).toBe(52);
    vi.useRealTimers();
  });
});
