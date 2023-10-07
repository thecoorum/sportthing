"use client";

import { useEffect } from "react";

import { Map, Activity as ActivityIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CardActivity } from "@/components/ui/activity";
import { Badge } from "@/components/ui/badge";

import Link from "next/link";

import { useActivities } from "@/hooks/activities";
import { useUser } from "@/hooks/useUser";
import { useBackButton } from "@twa.js/sdk-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const user = useUser();

  const router = useRouter();

  const backButton = useBackButton();

  useEffect(() => {
    backButton.show();
    backButton.on("click", () => {
      router.push("/");
    });

    return () => {
      backButton.hide();
    };
  }, [backButton, router]);

  const { data, error, loading } = useActivities();

  if (!user) return null;

  if (error) {
    return (
      <Alert>
        <ActivityIcon className="w-4 h-4" />
        <AlertTitle>Something went wrong...</AlertTitle>
        <AlertDescription>
          Try to reload the page. If the issue persists, contact support.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="w-full h-[150px]" />
        <Skeleton className="w-full h-[150px]" />
        <Skeleton className="w-full h-[150px]" />
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="space-y-4">
        <Alert>
          <Map className="w-4 h-4" />
          <AlertTitle>No activities found</AlertTitle>
          {user.role !== "administrator" && (
            <AlertDescription>
              There are no activities available at the moment. Please check back
              later.
            </AlertDescription>
          )}
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
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-3xl font-semibold leading-none tracking-tight">
          Activities
        </h2>
        {user.role === "administrator" && (
          <Link href="/activities/new">
            <Badge className="px-4 py-3 space-x-2">Create activity</Badge>
          </Link>
        )}
      </div>
      <div className="space-y-2">
        {data?.map((activity) => (
          <Link
            href={`/activities/${activity.id}`}
            key={activity.id}
            className="block"
          >
            <CardActivity data={activity} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
