export type Role = "user" | "admin" | "coach";

export type User = {
  id: number;
  name: string;
  username?: string;
  role: Role;
  created_at: string;
};
