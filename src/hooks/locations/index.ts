import useSWR, { Fetcher } from "swr";

import { useApi } from "../useApi";

import type {
  Location,
  LocationsParams,
  LocationResponse,
  LocationsFetcherResponse,
  LocationsResponse,
} from "./types";

export const useLocations = (
  params: LocationsParams = { per: 10, page: 1 }
) => {
  const api = useApi();

  const fetcher: Fetcher<LocationsFetcherResponse, string> = (url) =>
    api
      .get(url, { params })
      .then((response: LocationsResponse) => response.data);

  const { data, error, isLoading } = useSWR("/locations", fetcher);

  return {
    data: data?.locations,
    count: data?.count,
    error,
    loading: isLoading,
  };
};

export const useLocation = (id: string | null) => {
  const api = useApi();

  const fetcher: Fetcher<Location, string> = (url) =>
    api.get(url).then((response: LocationResponse) => response.data.location);

  const { data, error, isLoading } = useSWR(`/locations/${id}`, fetcher);

  return { data, error, loading: isLoading };
};
