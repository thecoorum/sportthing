"use client";

import { useEffect } from "react";

import { ActivityForm, schema } from "@/components/forms/activity";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useBackButton } from "@twa.js/sdk-react";

import * as z from "zod";

const Page = () => {
  const backButton = useBackButton();

  const api = useApi();
  const router = useRouter();

  useEffect(() => {
    const handleGoBack = () => {
      router.replace("/activities");
    };

    backButton.show();
    backButton.on("click", handleGoBack);

    return () => {
      backButton.off("click", handleGoBack);
      backButton.hide();
    };
  }, [backButton, router]);

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    return api.post("/activities", data).then(() => {
      router.replace("/activities");
    });
  };

  const handleCancel = () => {
    router.replace("/activities");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-medium">Create new activity</h2>
      <ActivityForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default Page;
