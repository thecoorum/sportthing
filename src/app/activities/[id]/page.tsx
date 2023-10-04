"use client";

import { useCallback, useEffect, useState } from "react";

import { Activity, Loader2, ChevronLeft, ServerCrash } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import Link from "next/link";

import { useUser } from "@/hooks/useUser";
import { useBackButton, usePopup } from "@twa.js/sdk-react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/components/ui/use-toast";
import { useActivity } from "@/hooks/activities";
import { PlainActivity } from "@/components/activity";

const Page = ({ params }: { params: { id: string } }) => {
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

  const { data: activity, error, loading } = useActivity(params.id);

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
        <Link href="/activities" className="flex items-center space-x-1">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Activities</span>
        </Link>
        <PlainActivity data={activity} />
      </div>
      {user.role === "admin" && (
        <div className="sticky bottom-0 flex items-center gap-2 py-4 bg-white/60 backdrop-blur-sm">
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

export default Page;
