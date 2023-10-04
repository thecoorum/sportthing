"use client";

import { useEffect } from "react";

import { Map, Activity } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Link from "next/link";

import { useActivities } from "@/hooks/activities";
import { useUser } from "@/hooks/useUser";
import { useBackButton } from "@twa.js/sdk-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        <Activity className="w-4 h-4" />
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
          {user.role === "admin" && (
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
    <div className="space-y-2">
      {data?.map((activity) => (
        <Link
          href={`/activities/${activity.id}`}
          key={activity.id}
          className="block"
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{activity.name}</CardTitle>
              <CardDescription>{activity.location.name}</CardDescription>
              <div className="flex items-center gap-1">
                <CardDescription>
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(activity.price / 100)}
                </CardDescription>
                <span className="text-sm text-muted-foreground">•</span>
                <CardDescription>{activity.duration} mins</CardDescription>
              </div>
              {activity.description && (
                <CardDescription>{activity.description}</CardDescription>
              )}
              {activity.coach && (
                <>
                  <hr />
                  <div className="mt-2 space-y-2">
                    <CardDescription>This activity is held by:</CardDescription>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={activity.coach.photo_url || ""} />
                        <AvatarFallback>
                          {activity.coach.name
                            .split(" ")
                            .map((part) => part.at(0)?.toUpperCase())}
                        </AvatarFallback>
                      </Avatar>
                      <h2 className="text-lg font-medium">
                        {activity.coach.name}
                      </h2>
                    </div>
                  </div>
                </>
              )}
            </CardHeader>
          </Card>
        </Link>
      ))}
      {user.role === "admin" && (
        <div className="sticky bottom-0 left-0 w-full py-4 bg-white/60 backdrop-blur-sm">
          <Link href="/activities/new" className="block">
            <Button size="lg" className="w-full">
              Create a new activity
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Page;
