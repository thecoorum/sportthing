"use client";

import { useEffect } from "react";

import { PlainActivity } from "@/components/activity";
import { Activity, ChevronLeft, ServerCrash } from "lucide-react";
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

import Link from "next/link";

import { useUser } from "@/hooks/useUser";
import { useBackButton } from "@twa.js/sdk-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/components/ui/use-toast";
import { useActivity } from "@/hooks/activities";

const Page = () => {
  const user = useUser();
  const searchParams = useSearchParams();

  const api = useApi();

  const router = useRouter();

  const { toast } = useToast();

  const backButton = useBackButton();

  useEffect(() => {
    const handleGoBack = () => {
      router.push("/activities");
    };

    backButton.show();
    backButton.on("click", handleGoBack);

    return () => {
      backButton.off("click", handleGoBack);
      backButton.hide();
    };
  }, [backButton, router]);

  const {
    data: activity,
    error,
    loading,
  } = useActivity(searchParams.get("id"));

  const handleDeleteActivity = async () => {
    api
      .delete(`/activities/${searchParams.get("id")}`)
      .then(() => {
        router.replace("/activities");
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
        <ServerCrash className="w-4 h-4" />
        <AlertTitle>Oops, something went wrong</AlertTitle>
        <AlertDescription>
          There was an error during fetching the activity, please try again. If
          the problem persists, please contact the support.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="space-y-1.5">
        <Skeleton className="w-[120px] h-[24px]" />
        <Skeleton className="w-[150px] h-[20px]" />
      </div>
    );
  }

  if (!activity) {
    return (
      <Alert>
        <Activity className="w-4 h-4" />
        <AlertTitle>Activity not found</AlertTitle>
        <AlertDescription>
          The activity you are looking for does not exist.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-1.5">
        <Link href="/activities" className="flex items-center space-x-1 mb-2">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Activities</span>
        </Link>
        <PlainActivity data={activity} />
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
                  this activity.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteActivity}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Link
            href={`/activities/${searchParams.get("id")}/edit`}
            className="block w-full"
          >
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
