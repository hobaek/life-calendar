export interface MeetingFrequency {
  type: "weekly" | "monthly" | "yearly";
  count: number;
}

export type AvatarColor = "coral" | "lavender" | "mint";

export type GridUnit = "days" | "weeks" | "months";

export interface Subject {
  id: string;
  name: string;
  emoji: string;
  avatarColor: AvatarColor;
  birthDate: string;
  expectedLifespan: number;
  firstMetDate?: string;
  meetingFrequency?: MeetingFrequency;
  createdAt: string;
}
