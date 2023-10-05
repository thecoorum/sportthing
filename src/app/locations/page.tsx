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
import { Badge } from "@/components/ui/badge";

import Link from "next/link";

import { useLocations } from "@/hooks/locations";
import { useUser } from "@/hooks/useUser";
import { useBackButton } from "@twa.js/sdk-react";
import { useRouter } from "next/navigation";

const Locations = () => {
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

  const { data, error, loading } = useLocations();

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
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-3xl font-semibold leading-none tracking-tight">
          Locations
        </h2>
        {user.role === "administrator" && (
          <Link href="/locations/new">
            <Badge className="px-4 py-3 space-x-2">Create location</Badge>
          </Link>
        )}
      </div>
      <div className="space-y-2">
        {data?.map((location) => (
          <Link
            href={`/locations/${location.id}`}
            key={location.id}
            className="block"
          >
            <Card className="w-full">
              <CardHeader>
                <CardTitle>{location.name}</CardTitle>
                <div className="space-y-4">
                  {!!location.address && (
                    <>
                      <CardDescription>{location.address}</CardDescription>
                      <hr />
                    </>
                  )}
                  {!!location.description && (
                    <CardDescription>{location.description}</CardDescription>
                  )}
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Locations;
