"use client";

import { useEffect } from "react";

import { Activity, ChevronLeft } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { TabsComponent as Tabs } from "./tabs";

import Link from "next/link";

import { useLocation } from "@/hooks/locations";
import { useUser } from "@/hooks/useUser";
import { useBackButton } from "@twa.js/sdk-react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/components/ui/use-toast";

const Page = ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { from: string; fromLabel: string };
}) => {
  const user = useUser();

  const api = useApi();

  const router = useRouter();

  const { toast } = useToast();

  const backButton = useBackButton();

  useEffect(() => {
    const handleGoBack = () => {
      router.push(searchParams.from || "/locations");
    };

    backButton.show();
    backButton.on("click", handleGoBack);

    return () => {
      backButton.off("click", handleGoBack);
      backButton.hide();
    };
  }, [backButton, router, searchParams.from]);

  const { data: location, error, loading } = useLocation(params.id);

  const handleDeleteLocation = async () => {
    api
      .delete(`/locations/${params.id}`)
      .then(() => {
        router.replace(searchParams.from || "/locations");
      })
      .catch((error: Error) => {
        console.error(error);

        toast({
          title: "Error occured",
          description: error.message,
        });
      });
  };

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
      <div className="space-y-6">
        <div className="space-y-1.5">
          <div className="space-y-3">
            <Link
              href={searchParams.from || "/locations"}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">
                {searchParams.fromLabel || "Locations"}
              </span>
            </Link>
            <h2 className="text-3xl font-semibold leading-none tracking-tight">
              {location?.name}
            </h2>
          </div>
          <div className="space-y-2">
            {location?.address && (
              <p className="text-sm text-muted-foreground">
                {location.address}
              </p>
            )}
            {location?.description && (
              <p className="text-md">
                {location.description}
              </p>
            )}
          </div>
        </div>
        <Tabs locationId={params.id} />
      </div>
      {user.role === "administrator" && (
        <div className="sticky bottom-0 flex items-center gap-2 py-4 bg-white/60 backdrop-blur-sm">
          <AlertDialog>
            <AlertDialogTrigger>
              <Button size="lg" variant="destructive">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this location.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteLocation}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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

export default Page;
