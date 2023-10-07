import type { Tables } from "@/database.extensions";

export type Employee = Tables<"employees"> & {
  activities?: Tables<"activities">[];
  location: Tables<"locations">;
  user: Tables<"users">;
};

export type Params = {
  location_id?: string | string[];
  activity_id?: string | string[];
  page?: number;
  per?: number;
};

export type EmployeeResponse = {
  data: {
    employee: Employee;
  };
};

export type EmployeesResponse = {
  data: {
    employees: Employee[];
  };
};
