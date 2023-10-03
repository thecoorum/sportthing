"use client";

import { useEffect } from "react";

import { LocationForm, schema } from "@/components/location-form";

import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useBackButton } from "@twa.js/sdk-react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const LocationCreatePage = () => {
  const backButton = useBackButton();

  const api = useApi();
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const handleGoBack = () => {
      router.replace("/locations");
    };

    backButton.show();
    backButton.on("click", handleGoBack);

    return () => {
      backButton.off("click", handleGoBack);
      backButton.hide();
    };
  }, [backButton, router]);

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    return api
      .post("/locations", data)
      .then(() => {
        router.replace("/locations");
      })
  };

  const handleCancel = () => {
    router.replace("/locations");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-medium">Create new location</h2>
      <FormProvider {...form}>
        <LocationForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </FormProvider>
    </div>
  );
};

export default LocationCreatePage;
