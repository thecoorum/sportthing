"use client";

import { PropsWithChildren } from "react";

import { useSDK } from "@twa.js/sdk-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export const ComponentsProvider = ({ children }: PropsWithChildren) => {
  const { didInit, components, error } = useSDK();

  if (error) {
    return (
      <div className="p-4">
        <Alert>
          <AlertTitle>Oops, something went wrong</AlertTitle>
          <AlertDescription>
            Please try again. If the problem persists, please contact support.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!didInit || !components) {
    return (
      <div className="p-4 space-y-2">
        <Skeleton className="w-[100px] h-[20px]" />
        <Skeleton className="w-[150px] h-[20px]" />
        <Skeleton className="w-[75px] h-[20px]" />
      </div>
    );
  }

  return <>{children}</>;
};
