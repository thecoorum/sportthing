"use client";

import { useEffect } from "react";

import { PlainActivity } from "@/components/ui/activity";
import { Activity, ServerCrash } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/components/ui/use-toast";
import { useActivity } from "@/hooks/activities";

const Page = ({ params }: { params: { id: string } }) => {
  const user = useUser();

  const api = useApi();

  const router = useRouter();

  const { toast } = useToast();

  const backButton = useBackButton();

  useEffect(() => {
    const handleGoBack = () => {
      router.back();
    };

    backButton.show();
    backButton.on("click", handleGoBack);

    return () => {
      backButton.off("click", handleGoBack);
      backButton.hide();
    };
  }, [backButton, router]);

  const { data: activity, error, loading } = useActivity(params.id);

  const handleDeleteActivity = async () => {
    api
      .delete(`/activities/${params.id}`)
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
      <PlainActivity data={activity} />
      <div className="flex flex-col sticky bottom-0 py-4 bg-white/60 backdrop-blur-sm space-y-2">
        <Link
          href={{ pathname: "/book", query: { activity: params.id } }}
          className="block w-full"
        >
          <Button size="lg" className="w-full">
            Book activity
          </Button>
        </Link>
        {user.role === "administrator" && (
          <div className="flex items-center gap-2">
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
              href={`/activities/${params.id}/edit`}
              className="block w-full"
            >
              <Button size="lg" className="w-full" variant="outline">
                Edit
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
