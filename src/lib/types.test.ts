import { describe, it, expect } from "vitest";
import {
  AVATAR_COLORS,
  AVATAR_COLOR_MAP,
  DEFAULT_EMOJIS,
  STORAGE_KEY,
} from "./constants";

describe("constants", () => {
  it("AVATAR_COLORS contains the three expected colors", () => {
    expect(AVATAR_COLORS).toEqual(["coral", "lavender", "mint"]);
  });

  it("AVATAR_COLOR_MAP has entries for all AVATAR_COLORS", () => {
    for (const color of AVATAR_COLORS) {
      expect(AVATAR_COLOR_MAP[color]).toBeDefined();
      expect(AVATAR_COLOR_MAP[color].bg).toBeTypeOf("string");
      expect(AVATAR_COLOR_MAP[color].text).toBeTypeOf("string");
    }
  });

  it("DEFAULT_EMOJIS is a non-empty array", () => {
    expect(DEFAULT_EMOJIS.length).toBeGreaterThan(0);
  });

  it("STORAGE_KEY is the expected string", () => {
    expect(STORAGE_KEY).toBe("life-calendar-subjects");
  });
});
