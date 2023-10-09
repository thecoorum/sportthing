"use client";

import { useEffect } from "react";

import { LocationForm, schema } from "@/components/forms/location";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useBackButton } from "@twa.js/sdk-react";

import * as zod from "zod";

const LocationCreatePage = () => {
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
    return api.post("/locations", data).then(() => {
      router.replace("/locations");
    });
  };

  const handleCancel = () => {
    router.replace("/locations");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-semibold leading-none tracking-tight">
        Create new location
      </h2>
      <LocationForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default LocationCreatePage;
