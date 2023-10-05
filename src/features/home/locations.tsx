import { ChevronRight, Map } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import Link from "next/link";

import { useLocations } from "@/hooks/locations";
import { useUser } from "@/hooks/useUser";
import { LocationCard } from "@/components/location";

const per = 3;

export const Locations = () => {
  const user = useUser();

  const { data, count, error, loading } = useLocations({ per });

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="w-[130px] h-[30px]" />
        <div className="space-y-2">
          <Skeleton className="w-full h-[150px]" />
          <Skeleton className="w-full h-[150px]" />
        </div>
      </div>
    );
  }

  if (error) return null;

  if (!data?.length) {
    return (
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold leading-none tracking-tight">
          Locations
        </h2>
        <Alert>
          <Map className="w-4 h-4" />
          <AlertTitle>No locations found</AlertTitle>
          {user.role === "administrator" && (
            <div className="space-y-3">
              <AlertDescription>
                You can create a new location by clicking the button below.
              </AlertDescription>
              <Link href="/locations/new" className="block">
                <Button className="w-full">Create a new location</Button>
              </Link>
            </div>
          )}
          {user.role !== "administrator" && (
            <AlertDescription>
              This organization has no locations yet. Please come back later.
            </AlertDescription>
          )}
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-3xl font-semibold leading-none tracking-tight">
          Locations
        </h2>
        {count && count > per && (
          <Link
            href={{
              pathname: "/locations",
              query: { from: "/", fromLabel: "Home" },
            }}
            className="flex items-center gap-1"
          >
            <span className="text-sm">View all</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="space-y-2">
        {data.map((location) => (
          <Link
            key={location.id}
            href={{
              pathname: `/locations/${location.id}`,
              query: { from: "/", fromLabel: "Home" },
            }}
            className="block"
          >
            <LocationCard data={location} />
          </Link>
        ))}
      </div>
    </div>
  );
};
