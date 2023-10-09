"use client";

import { useEffect } from "react";

import { ActivityForm, schema } from "@/components/forms/activity";

import Link from "next/link";

import { useRouter, useSearchParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useBackButton } from "@twa.js/sdk-react";

import * as zod from "zod";

const Page = () => {
  const searchParams = useSearchParams();

  const backButton = useBackButton();

  const api = useApi();
  const router = useRouter();

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

  const handleSubmit = async (data: zod.infer<typeof schema>) => {
    return api.post("/activities", data).then(() => {
      router.replace("/activities");
    });
  };

  const handleCancel = () => {
    router.replace("/activities");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-semibold leading-none tracking-tight">
        Create new activity
      </h2>
      <ActivityForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        locationId={searchParams.get("location_id")}
      />
    </div>
  );
};

export default Page;
