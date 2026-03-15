import { describe, it, expect, beforeEach } from "vitest";
import {
  getSubjects,
  saveSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
  encodeSubjectForUrl,
  decodeSubjectFromUrl,
} from "@/lib/storage";
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

beforeEach(() => {
  localStorage.clear();
});

describe("getSubjects / saveSubjects", () => {
  it("returns empty array when no data", () => {
    expect(getSubjects()).toEqual([]);
  });

  it("saves and retrieves subjects", () => {
    saveSubjects([mockSubject]);
    expect(getSubjects()).toEqual([mockSubject]);
  });
});

describe("addSubject", () => {
  it("adds a subject to storage", () => {
    addSubject(mockSubject);
    expect(getSubjects()).toHaveLength(1);
  });
});

describe("updateSubject", () => {
  it("updates an existing subject", () => {
    addSubject(mockSubject);
    updateSubject({ ...mockSubject, name: "Mother" });
    expect(getSubjects()[0].name).toBe("Mother");
  });
});

describe("deleteSubject", () => {
  it("removes a subject by id", () => {
    addSubject(mockSubject);
    deleteSubject("test-1");
    expect(getSubjects()).toHaveLength(0);
  });
});

describe("URL encoding/decoding", () => {
  it("round-trips a subject through base64", () => {
    const encoded = encodeSubjectForUrl(mockSubject);
    const decoded = decodeSubjectFromUrl(encoded);
    expect(decoded).toEqual(mockSubject);
  });

  it("returns null for invalid data", () => {
    expect(decodeSubjectFromUrl("invalid!!!")).toBeNull();
  });
});
