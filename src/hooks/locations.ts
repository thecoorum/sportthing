import { useEffect, useState } from "react";

import { Tables } from "@/database.extensions";
import { useApi } from "./useApi";

type LocationResponse = {
  data: {
    location: Tables<"locations">;
  }
}

type LocationsResponse = {
  data: {
    locations: Tables<"locations">[]
  };
}

export const useLocations = () => {
  const [locations, setLocations] = useState<Tables<"locations">[] | []>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const api = useApi();

  useEffect(() => {
    setLoading(true);

    api
      .get("/locations")
      .then(({ data }: LocationsResponse) => {
        setLocations(data.locations);
      })
      .catch((error: Error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return { data: locations, error, loading };
};

export const useLocation = (id: string) => {
  const [location, setLocation] = useState<Tables<"locations"> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const api = useApi();

  useEffect(() => {
    setLoading(true);

    api
      .get(`/locations/${id}`)
      .then(({ data }: LocationResponse) => {
        setLocation(data.location);
      })
      .catch((error: Error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return { data: location, error, loading };
};
