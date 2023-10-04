"use client";

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProfileForm } from "@/components/forms/profile";

import { useUser } from "@/hooks/useUser";
import { useDatabase } from "@/hooks/useDatabase";
import { useSWRConfig } from "swr";

import { DateTime } from "luxon";

import { STATUS_MAP } from "@/constants";

import type { FormValues } from "@/components/forms/profile";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const [editing, setEditing] = useState<boolean>(false);

  const user = useUser();
  const database = useDatabase();

  const { mutate } = useSWRConfig();

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((name) => name[0])
    .join("");
  const withStatus = ["admin", "coach"].includes(user.role);

  // const handleSubmit = async (data: FormValues) => {
  //   const { data: serverData, error } = await database
  //     .from("users")
  //     .update({
  //       name: data.name,
  //       username: data.username,
  //     })
  //     .eq("id", user.id)
  //     .select('*')
  //     .single();

  //   if (error) {
  //     console.error(error);
  //   }

  //   mutate('/auth', serverData)
  //   setEditing(false);
  // };

  const handleCancel = () => {
    setEditing(false);
  };

  return (
    <div className="flex flex-col h-full p-4 justify-between">
      <div className="flex flex-col space-y-2 items-center">
        <Avatar className="w-16 h-16">
          <AvatarImage />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {editing && (
          <ProfileForm
            // onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
        {!editing && (
          <>
            <h2 className="text-2xl">{user.name}</h2>
            {withStatus && (
              <Badge className="py-2 px-4">{STATUS_MAP[user.role]}</Badge>
            )}
            {user.username && (
              <span className="text-sm text-muted-foreground">
                @{user.username}
              </span>
            )}
            <Button
              variant="outline"
              size="lg"
              onClick={() => setEditing(true)}
            >
              Edit profile
            </Button>
          </>
        )}
      </div>
      <div className="flex flex-col space-y-2 items-center">
        <span className="text-sm text-muted-foreground">
          Member since {/* Forced to English locale for now */}
          {DateTime.fromISO(user.created_at).setLocale("en").toLocaleString({
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
};

export default Profile;
