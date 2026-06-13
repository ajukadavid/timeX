export const ROLE = {
  ADMIN: "admin",
  MANAGER: "manager",
  STAFF: "staff",
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];
