import useSWR, { Fetcher } from "swr";

import { Tables } from "@/database.extensions";
import { useApi } from "./useApi";

type Activity = Tables<"activities"> & {
  employee: Tables<"users"> & Tables<"employees">;
  location: Tables<"locations">;
};

type ActivitiesParams = {
  location_id?: string | string[];
  coach_id?: string | string[];
};

type ActivityResponse = {
  data: {
    activity: Activity;
  };
};

type ActivitiesResponse = {
  data: {
    activities: Activity[];
  };
};

export const useActivities = (params: ActivitiesParams = {}) => {
  const api = useApi();

  const fetcher: Fetcher<Activity[], string> = (url) =>
    api
      .get(url, { params })
      .then((response: ActivitiesResponse) => response.data.activities);

  const { data, error, isLoading } = useSWR("/activities", fetcher);

  return { data, error, loading: isLoading };
};

export const useActivity = (id: string | null) => {
  const api = useApi();

  const fetcher: Fetcher<Activity, string> = (url) =>
    api.get(url).then((response: ActivityResponse) => response.data.activity);

  const { data, error, isLoading } = useSWR(`/activities/${id}`, fetcher);

  return { data, error, loading: isLoading };
};
