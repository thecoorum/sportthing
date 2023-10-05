"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProfileForm, FormValues } from "@/components/forms/profile";

import { useUser } from "@/hooks/useUser";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/components/ui/use-toast";
import { useSWRConfig } from "swr";

import { DateTime } from "luxon";

import { statuses } from "@/constants";

const Profile = () => {
  const [editing, setEditing] = useState<boolean>(false);

  const user = useUser();
  const api = useApi();

  const { toast } = useToast();

  const { mutate } = useSWRConfig();

  if (!user) return null;

  const withStatus = ["administrator", "coach"].includes(user.role);

  const handleSubmit = async (data: FormValues) => {
    api
      .post(`/users/${user.id}`, data)
      .then((response) => {
        mutate("/auth", response.data.user);
      })
      .catch((error: Error) => {
        toast({
          title: "An error occured",
          description: error.message,
        });
      })
      .finally(() => {
        setEditing(false);
      });
  };

  const handleCancel = () => {
    setEditing(false);
  };

  return (
    <div className="flex flex-col h-full p-4 justify-between">
      <div className="flex flex-col space-y-2 items-center">
        <Avatar name={user.name} className="w-16 h-16" />
        {editing && (
          <ProfileForm onSubmit={handleSubmit} onCancel={handleCancel} />
        )}
        {!editing && (
          <>
            <h2 className="text-2xl">{user.name}</h2>
            {withStatus && (
              <Badge className="py-3 px-4">{statuses[user.role]}</Badge>
            )}
            {user.username && (
              <span className="text-sm text-muted-foreground">
                @{user.username}
              </span>
            )}
            <span className="text-sm text-muted-foreground">
              Member since{" "}
              {DateTime.fromISO(user.created_at || '')
                .setLocale("en")
                .toLocaleString({
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
            </span>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setEditing(true)}
              className="w-full"
            >
              Edit profile
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
