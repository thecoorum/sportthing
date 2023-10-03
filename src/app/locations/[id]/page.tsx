"use client";

import { useCallback, useEffect, useState } from "react";

import { Activity, Dumbbell, Loader2, ChevronLeft } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import Link from "next/link";

import { useLocation } from "@/hooks/locations";
import { useUser } from "@/hooks/useUser";
import { useBackButton, usePopup } from "@twa.js/sdk-react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/components/ui/use-toast";

const LocationPage = ({ params }: { params: { id: string } }) => {
  const [deletePending, setDeletePending] = useState<boolean>(false);

  const user = useUser();

  const api = useApi();

  const router = useRouter();

  const { toast } = useToast();

  const backButton = useBackButton();
  const popup = usePopup();

  useEffect(() => {
    const handleGoBack = () => {
      router.push("/locations");
    };

    backButton.show();
    backButton.on("click", handleGoBack);

    return () => {
      backButton.off("click", handleGoBack);
      backButton.hide();
    };
  }, [backButton, router]);

  const { data: location, error, loading } = useLocation(params.id);

  const handleDelete = useCallback(async () => {
    setDeletePending(true);

    const action = await popup.open({
      title: "Are you sure?",
      message: "This action cannot be undone.",
      buttons: [
        {
          id: "cancel",
          type: "cancel",
        },
        {
          id: "confirm",
          type: "destructive",
          text: "Delete",
        },
      ],
    });

    if (action === "confirm") {
      api
        .delete(`/locations/${params.id}`)
        .then(() => {
          router.replace("/locations");
        })
        .catch((error: Error) => {
          console.error(error);

          toast({
            title: "Error occured",
            description: error.message,
          });
        })
        .finally(() => {
          setDeletePending(false);
        });
    }

    if (action === "cancel") {
      setDeletePending(false);
    }
  }, [params.id, popup, api, toast, router]);

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
        <div className="space-y-3">
          <Link href="/locations" className="flex items-center space-x-1">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Locations</span>
          </Link>
          <h2 className="text-3xl font-semibold leading-none tracking-tight">
            {location?.name}
          </h2>
        </div>
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
            {user.role === "admin" && (
              <Button className="w-full mt-2" size="lg" variant="outline">Create activity in this location</Button>
            )}
          </AlertDescription>
        </Alert>
      </div>
      {user.role === "admin" && (
        <div className="flex items-center gap-2">
          <Button
            size="lg"
            onClick={handleDelete}
            disabled={deletePending}
            variant="destructive"
          >
            {deletePending && (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            )}
            {!deletePending && "Delete"}
          </Button>
          <Link href={`/locations/${params.id}/edit`} className="block w-full">
            <Button size="lg" className="w-full" variant="outline">
              Edit
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default LocationPage;
