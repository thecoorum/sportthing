"use client";

import { useCallback, useEffect, memo } from "react";

import { useHapticFeedback, useThemeParams } from "@twa.js/sdk-react";
import { useRouter } from "next/navigation";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

const Home = memo(() => {
  const haptic = useHapticFeedback();
  const theme = useThemeParams();

  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));

    fetch("/api/validate", {
      method: "POST",
      body: JSON.stringify({
        tgWebAppData: params.get("tgWebAppData"),
      }),
    })
      .then((response) => {
        return response.json()
      })
      .then(({ user }) => {
        console.log(user);
      })
      .catch((error) => {
        console.log(error)

        haptic.notificationOccurred("error");
      });
  }, [haptic]);

  const handleTrigger = useCallback(() => {
    haptic.notificationOccurred("success");

    router.push("/route");
  }, [haptic, router]);

  const handleApiCall = useCallback(() => {
    fetch("/api/message")
      .then((res) => res.json())
      .then((data) => {
        haptic.notificationOccurred("success");

        console.log(data);
      })
      .catch((err) => {
        haptic.notificationOccurred("error");

        console.error(err);
      });
  }, [haptic]);

  return (
    <div
      className={cn(
        "flex flex-col p-5 justify-center items-center",
        `bg-[${theme.backgroundColor}]`,
        `text-[${theme.textColor}]`
      )}
    >
      <Alert className="mb-10">
        <AlertTitle>sportthing</AlertTitle>
        <AlertDescription>
          Welcome to the new era of personal training
        </AlertDescription>
      </Alert>
      <div className="flex gap-5">
        <Button onClick={handleApiCall}>Call API</Button>
        <Button variant="outline" onClick={handleTrigger}>
          Navigate
        </Button>
      </div>
    </div>
  );
});

Home.displayName = "Home";

export default Home;
