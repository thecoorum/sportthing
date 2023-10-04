import useSWR, { Fetcher } from "swr";

import { Tables } from "@/database.extensions";
import { useApi } from "./useApi";

type Coach = Tables<"coaches"> & {
  activities?: Tables<"activities">[];
  location: Tables<"locations">;
};

type CoachesParams = {
  location_id?: string | string[];
  activity_id?: string | string[];
};

type CoachResponse = {
  data: {
    coach: Coach;
  };
};

type CoachesResponse = {
  data: {
    coaches: Coach[];
  };
};

export const useCoaches = (params: CoachesParams = {}) => {
  const api = useApi();

  const fetcher: Fetcher<Coach[], string> = (url) =>
    api
      .get(url, { params })
      .then((response: CoachesResponse) => response.data.coaches);

  const { data, error, isLoading } = useSWR("/coaches", fetcher);

  return { data, error, loading: isLoading };
};

export const useCoach = (id: number) => {
  const api = useApi();

  const fetcher: Fetcher<Coach, string> = (url) =>
    api.get(url).then((response: CoachResponse) => response.data.coach);

  const { data, error, isLoading } = useSWR(`/coaches/${id}`, fetcher);

  return { data, error, loading: isLoading };
};
