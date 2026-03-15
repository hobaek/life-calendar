import { AvatarColor } from "./types";

export const AVATAR_COLORS: AvatarColor[] = ["coral", "lavender", "mint"];

export const AVATAR_COLOR_MAP: Record<
  AvatarColor,
  { bg: string; text: string }
> = {
  coral: { bg: "bg-coral-light", text: "text-coral" },
  lavender: { bg: "bg-lavender-light", text: "text-lavender" },
  mint: { bg: "bg-mint-light", text: "text-mint" },
};

export const DEFAULT_EMOJIS = [
  "👩",
  "👨",
  "👧",
  "👦",
  "🐶",
  "🐱",
  "🐰",
  "🐦",
  "❤️",
];

export const STORAGE_KEY = "life-calendar-subjects";
export const PROFILE_STORAGE_KEY = "life-calendar-profile";
