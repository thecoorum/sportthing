import { createContext, PropsWithChildren } from "react";
import useSWR, { Fetcher } from "swr";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useApi } from "@/hooks/useApi";

import { ServerCrash } from "lucide-react";

import type { Tables } from "@/database.extensions";

interface UserResponse {
  data: {
    user: Tables<"users">;
    success: boolean;
  };
}

export const UserContext = createContext<Tables<"users"> | undefined>(
  undefined
);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const api = useApi();

  const fetcher: Fetcher<Tables<"users">, string> = (url) =>
    api.post(url).then((response: UserResponse) => response.data.user);

  const { data, error, isLoading } = useSWR("/user", fetcher);

  if (error) {
    return (
      <div className="p-4">
        <Alert>
          <ServerCrash className="w-4 h-4" />
          <AlertTitle>Oops, something went wrong</AlertTitle>
          <AlertDescription>
            There was an error during fetching the user, please try again. If
            the problem persists, please contact the support.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="w-full h-[150px]" />
        <Skeleton className="w-full h-[150px]" />
        <Skeleton className="w-full h-[150px]" />
      </div>
    );
  }

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};
