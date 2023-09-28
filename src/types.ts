export type Role = "user" | "admin" | "coach";

export type User = {
  id: number;
  name: string;
  username?: string;
  role: Role;
  created_at: string;
};

export type Location = {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}
