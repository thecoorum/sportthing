import useSWR, { Fetcher } from "swr";

import { Tables } from "@/database.extensions";
import { useApi } from "./useApi";

type LocationsParams = {
  per?: number;
  page?: number;
};

type LocationResponse = {
  data: {
    location: Tables<"locations">;
  };
};

type LocationsResponse = {
  data: {
    locations: Tables<"locations">[];
    count: number;
  };
};

type LocationsFetcherResponse = {
  locations: Tables<"locations">[];
  count: number;
};

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

export const useLocation = (id: string) => {
  const api = useApi();

  const fetcher: Fetcher<Tables<"locations">, string> = (url) =>
    api.get(url).then((response: LocationResponse) => response.data.location);

  const { data, error, isLoading } = useSWR(`/locations/${id}`, fetcher);

  return { data, error, loading: isLoading };
};
