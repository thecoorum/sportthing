"use client";

import { useEffect, useState } from "react";

import { LocationForm, schema } from "@/components/location-form";

import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/components/ui/use-toast";
import { useBackButton } from "@twa.js/sdk-react";
import { useLocation } from "@/hooks/locations";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const LocationEditPage = ({ params }: { params: { id: string } }) => {
  const [editPending, setEditPending] = useState<boolean>(false);

  const { data: location } = useLocation(params.id);

  const backButton = useBackButton();

  const api = useApi();
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

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

  const handleSubmit = (data: z.infer<typeof schema>) => {
    setEditPending(true);

    api
      .post(`/locations/${params.id}`, {
        id: params.id,
        ...data,
      })
      .then(() => {
        router.replace(`/locations/${params.id}`);
      })
      .catch((error: Error) => {
        console.error(error);

        toast({
          title: "Error occured",
          description: error.message,
        });
      })
      .finally(() => {
        setEditPending(false);
      });
  };

  const handleFormSubmit = () => {
    form.handleSubmit(handleSubmit)();
  };

  const handleCancel = () => {
    router.replace(`/locations/${params.id}`);
  };

  useEffect(() => {
    if (location) {
      form.reset({
        name: location.name,
        description: location.description || "",
        address: location.address || "",
      });
    }
  }, [location, form]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-medium">Edit location</h2>
      <FormProvider {...form}>
        <LocationForm
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          loading={editPending}
          type="edit"
        />
      </FormProvider>
    </div>
  );
};

export default LocationEditPage;
