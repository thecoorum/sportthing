"use client";

import { useEffect } from "react";

import { ActivityForm, schema } from "@/components/forms/activity";
import { Skeleton } from "./skeleton";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useBackButton } from "@twa.js/sdk-react";
import { useActivity } from "@/hooks/activities";

import * as z from "zod";

const Page = ({ params }: { params: { id: string } }) => {
  const backButton = useBackButton();

  const api = useApi();
  const router = useRouter();

  const { data: activity, loading } = useActivity(params.id);

  useEffect(() => {
    const handleGoBack = () => {
      router.replace(`/activities/${params.id}`);
    };

    backButton.show();
    backButton.on("click", handleGoBack);

    return () => {
      backButton.off("click", handleGoBack);
      backButton.hide();
    };
  }, [backButton, router, params.id]);

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    return api
      .post(`/activities/${params.id}`, {
        id: params.id,
        ...data,
      })
      .then(() => {
        router.replace(`/activities/${params.id}`);
      });
  };

  const handleCancel = () => {
    router.replace(`/activities/${params.id}`);
  };

  if (!activity || loading) return <Skeleton />;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-medium">Edit activity</h2>
      <ActivityForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        activity={activity}
        type="edit"
      />
    </div>
  );
};

export default Page;
