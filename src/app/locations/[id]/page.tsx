"use client";

import { Activity, Dumbbell } from "lucide-react";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import { useLocation } from "@/hooks/locations";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const LocationPage = ({ params }: { params: { id: string } }) => {
  const user = useUser();

  const { data: location, error, loading } = useLocation(params.id);

  if (!user) return null;

  if (error) {
    return (
      <Alert>
        <Activity className="w-4 h-4" />
        <AlertTitle>Something went wrong...</AlertTitle>
        <AlertDescription>
          Try to reload the page. If the issue persists, contact support.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading && !location) {
    return (
      <div className="space-y-1.5">
        <Skeleton className="w-[120px] h-[24px]" />
        <Skeleton className="w-[150px] h-[20px]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-3xl font-semibold leading-none tracking-tight">
          {location?.name}
        </h2>
        <div className="space-y-4">
          {location?.address && (
            <p className="text-sm text-muted-foreground">{location.address}</p>
          )}
          {location?.description && (
            <>
              <hr />
              <p className="text-sm text-muted-foreground">
                {location.description}
              </p>
            </>
          )}
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold leading-none tracking-tight">
          Activities in this location
        </h2>
        <Alert>
          <Dumbbell className="w-4 h-4" />
          <AlertTitle>No activities</AlertTitle>
          <AlertDescription>
            No activities in this location at the moment. Please come back
            later.
          </AlertDescription>
        </Alert>
      </div>
      {user.role === "admin" && (
        <Link href={`/locations/${location?.id}/edit`}>
          <Button variant="outline" size="lg">
            Edit location
          </Button>
        </Link>
      )}
    </div>
  );
};

export default LocationPage;
