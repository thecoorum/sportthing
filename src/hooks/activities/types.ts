import { Tables } from "@/database.extensions";

export type Activity = Tables<"activities"> & {
  employee: Tables<'employees'> & {
    user: Tables<'users'>;
  };
  location: Tables<"locations">;
};

export type ActivitiesParams = {
  location_id?: string | string[];
  coach_id?: string | string[];
};

export type ActivityResponse = {
  data: {
    activity: Activity;
  };
};

export type ActivitiesResponse = {
  data: {
    activities: Activity[];
  };
};