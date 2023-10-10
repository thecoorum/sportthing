import useSWR, { Fetcher } from "swr";

import { useApi } from "../useApi";

import type {
  Activity,
  ActivitiesParams,
  ActivityResponse,
  ActivitiesResponse,
  ActivitiesFetcherResponse,
} from "./types";

export const useActivities = (params: ActivitiesParams = {}) => {
  const api = useApi();

  const fetcher: Fetcher<ActivitiesFetcherResponse, string> = (url) =>
    api
      .get(url, { params })
      .then((response: ActivitiesResponse) => response.data);

  const { data, error, isLoading } = useSWR("/activities", fetcher);

  return {
    data: data?.activities,
    count: data?.count,
    error,
    loading: isLoading,
  };
};

export const useActivity = (id: string | null) => {
  const api = useApi();

  const fetcher: Fetcher<Activity, string> = (url) =>
    api.get(url).then((response: ActivityResponse) => response.data.activity);

  const { data, error, isLoading } = useSWR(`/activities/${id}`, fetcher);

  return { data, error, loading: isLoading };
};
