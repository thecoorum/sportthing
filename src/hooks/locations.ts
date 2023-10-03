import useSWR, { Fetcher } from "swr";

import { Tables } from "@/database.extensions";
import { useApi } from "./useApi";

type LocationResponse = {
  data: {
    location: Tables<"locations">;
  };
};

type LocationsResponse = {
  data: {
    locations: Tables<"locations">[];
  };
};

export const useLocations = () => {
  const api = useApi();

  const fetcher: Fetcher<Tables<"locations">[], string> = (url) =>
    api.get(url).then((response: LocationsResponse) => response.data.locations);

  const { data, error, isLoading } = useSWR("/locations", fetcher);

  return { data, error, loading: isLoading };
};

export const useLocation = (id: string) => {
  const api = useApi();

  const fetcher: Fetcher<Tables<"locations">, string> = (url) =>
    api.get(url).then((response: LocationResponse) => response.data.location);

  const { data, error, isLoading } = useSWR(`/locations/${id}`, fetcher);

  return { data, error, loading: isLoading };
};
