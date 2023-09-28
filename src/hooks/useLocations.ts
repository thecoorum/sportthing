import { useEffect, useState } from "react";

import type { Location } from "@/types";

export const useLocations = () => {
  const [locations, setLocations] = useState<Location[] | []>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    fetch("/api/locations")
      .then((response) => response.json())
      .then((data: Location[]) => setLocations(data))
      .catch((error: Error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return { locations, error, loading };
};
