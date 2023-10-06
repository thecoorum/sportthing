"use client";

import { useEffect } from "react";

import { ChevronLeft } from "lucide-react";
import { ActivityForm, schema } from "@/components/forms/activity";
import { Skeleton } from "./skeleton";

import Link from "next/link";

import { useRouter, useSearchParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useBackButton } from "@twa.js/sdk-react";
import { useActivity } from "@/hooks/activities";

import * as zod from "zod";

const Page = () => {
  const backButton = useBackButton();

  const api = useApi();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: activity, loading } = useActivity(searchParams.get('id'));

  useEffect(() => {
    const handleGoBack = () => {
      router.replace(`/activities/${searchParams.get('id')}`);
    };

    backButton.show();
    backButton.on("click", handleGoBack);

    return () => {
      backButton.off("click", handleGoBack);
      backButton.hide();
    };
  }, [backButton, router, searchParams]);

  const handleSubmit = async (data: zod.infer<typeof schema>) => {
    return api
      .post(`/activities/${searchParams.get('id')}`, {
        id: searchParams.get('id'),
        ...data,
      })
      .then(() => {
        router.replace(`/activities/${searchParams.get('id')}`);
      });
  };

  const handleCancel = () => {
    router.replace(`/activities/${searchParams.get('id')}`);
  };

  if (!activity || loading) return <Skeleton />;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Link
          href={`/activities/${searchParams.get('id')}`}
          className="flex items-center space-x-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">{activity.name}</span>
        </Link>
        <h2 className="text-3xl font-semibold leading-none tracking-tight">
          Edit activity
        </h2>
      </div>
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
