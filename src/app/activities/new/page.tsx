"use client";

import { useEffect } from "react";

import { ChevronLeft } from "lucide-react";
import { ActivityForm, schema } from "@/components/forms/activity";

import Link from "next/link";

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
      <div className="space-y-3">
        <Link href="/activities" className="flex items-center space-x-1">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Activities</span>
        </Link>
        <h2 className="text-3xl font-semibold leading-none tracking-tight">
          Create new activity
        </h2>
      </div>
      <ActivityForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default Page;
