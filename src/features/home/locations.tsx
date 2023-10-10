import { ChevronRight, Map, ServerCrash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LocationCard } from "@/components/ui/location";

import { motion } from "framer-motion";
import Link from "next/link";

import { useLocations } from "@/hooks/locations";
import { useUser } from "@/hooks/useUser";

const per = 3;

export const Locations = () => {
  const user = useUser();

  const { data, count, error, loading } = useLocations({ per });

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="w-[130px] h-[30px]" />
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
          >
            <Skeleton className="w-full h-[150px]" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Skeleton className="w-full h-[150px]" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <Alert>
        <ServerCrash className="w-4 h-4" />
        <AlertTitle>Oops, something went wrong</AlertTitle>
        <AlertDescription>
          There was an error during fetching the bookings, please try again. If
          the problem persists, please contact the support.
        </AlertDescription>
      </Alert>
    );

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
          <Link href="/locations" className="flex items-center gap-1">
            <span className="text-sm">View all</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="space-y-2">
        {data.map((location) => (
          <Link
            key={location.id}
            href={`/locations/${location.id}`}
            className="block"
          >
            <LocationCard data={location} />
          </Link>
        ))}
      </div>
    </div>
  );
};
