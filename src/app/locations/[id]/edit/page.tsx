"use client";

import { useEffect } from "react";

import { ChevronLeft } from "lucide-react";
import { LocationForm, schema } from "@/components/forms/location";
import { Skeleton } from "./skeleton";

import Link from "next/link";

import { useRouter, useSearchParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useBackButton } from "@twa.js/sdk-react";
import { useLocation } from "@/hooks/locations";

import * as zod from "zod";

const LocationEditPage = ({ params }: { params: { id: string } }) => {
  const { data: location, loading } = useLocation(params.id);

  const backButton = useBackButton();

  const api = useApi();
  const router = useRouter();

  useEffect(() => {
    const handleGoBack = () => {
      router.replace(`/locations/${params.id}`);
    };

    backButton.show();
    backButton.on("click", handleGoBack);

    return () => {
      backButton.off("click", handleGoBack);
      backButton.hide();
    };
  }, [backButton, router, params.id]);

  const handleSubmit = async (data: zod.infer<typeof schema>) => {
    return api
      .post(`/locations/${params.id}`, {
        id: params.id,
        ...data,
      })
      .then(() => {
        router.replace(`/locations/${params.id}/`);
      });
  };

  const handleCancel = () => {
    router.replace(`/locations/${params.id}`);
  };

  if (!location || loading) return <Skeleton />;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Link
          href={`/locations/${location.id}`}
          className="flex items-center space-x-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">{location.name}</span>
        </Link>
        <h2 className="text-3xl font-semibold leading-none tracking-tight">
          Edit location
        </h2>
      </div>
      <LocationForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        type="edit"
        location={location}
      />
    </div>
  );
};

export default LocationEditPage;
