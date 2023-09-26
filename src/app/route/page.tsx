"use client";

import { useCallback, useEffect } from "react";

import { useRouter } from "next/navigation";
import { useBackButton } from "@twa.js/sdk-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const Page = () => {
  const router = useRouter();

  const backButton = useBackButton();

  useEffect(() => {
    const listener = () => router.back();

    backButton.on("click", listener);
    backButton.show();

    return () => {
      backButton.off("click", listener);
      backButton.hide();
    };
  }, [backButton, router]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="flex flex-col p-5 justify-center items-center">
      <Alert className="mb-10">
        <AlertTitle>sportthing</AlertTitle>
        <AlertDescription>
          This is another page of the mini app
        </AlertDescription>
      </Alert>
      <Button variant="outline" onClick={handleGoBack}>
        Back
      </Button>
    </div>
  );
};

export default Page;
