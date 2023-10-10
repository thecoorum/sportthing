import { ChevronRight, Map, ServerCrash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ActivityCard } from "@/components/ui/activity";

import { motion } from "framer-motion";
import Link from "next/link";

import { useUser } from "@/hooks/useUser";
import { useActivities } from "@/hooks/activities";

const per = 5;

export const Activities = () => {
  const user = useUser();

  const { data, count, error, loading } = useActivities({ per });

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
          There was an error during fetching the activities, please try again.
          If the problem persists, please contact the support.
        </AlertDescription>
      </Alert>
    );

  if (!data?.length) {
    return (
      <div className="space-y-3">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Activities
        </h3>
        <Alert>
          <Map className="w-4 h-4" />
          <AlertTitle>No activities found</AlertTitle>
          {user.role === "administrator" && (
            <div className="space-y-3">
              <AlertDescription>
                You can create a new activity by clicking the button below.
              </AlertDescription>
              <Link href="/activities/new" className="block">
                <Button className="w-full">Create a new activity</Button>
              </Link>
            </div>
          )}
          {user.role !== "administrator" && (
            <AlertDescription>
              This organization has no activities yet. Please come back later.
            </AlertDescription>
          )}
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Activities
        </h3>
        {count && count > per && (
          <Link href="/activities" className="flex items-center gap-1">
            <span className="text-sm">View all</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="space-y-2">
        {data.map((activity) => (
          <Link
            key={activity.id}
            href={`/activities/${activity.id}`}
            className="block"
          >
            <ActivityCard data={activity} />
          </Link>
        ))}
      </div>
    </div>
  );
};
