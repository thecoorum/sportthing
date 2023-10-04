import { UserX, ServerCrash } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardActivity } from "@/components/activity";

import Link from "next/link";

import { useUser } from "@/hooks/useUser";
import { useCoaches } from "@/hooks/coaches";
import { useActivities } from "@/hooks/activities";

type Props = {
  locationId: string;
};

const CoachesTab = ({ locationId }: Props) => {
  const user = useUser();

  const { data, loading, error } = useCoaches({ location_id: locationId });

  if (loading) {
    return <Skeleton className="w-full h-[150px]" />;
  }

  if (error) {
    return (
      <Alert>
        <ServerCrash className="w-4 h-4" />
        <AlertTitle>Oops, something went wrong</AlertTitle>
        <AlertDescription>
          There was an error during fetching the coches, please try again. If
          the problem persists, please contact the support.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data?.length) {
    return (
      <Alert>
        <UserX className="w-4 h-4" />
        <AlertTitle>No coaches</AlertTitle>
        <AlertDescription>
          No coaches at this location at the moment. Please come back later.
          {user.role === "admin" && (
            <Button className="w-full mt-2" size="lg" variant="outline">
              Add coach to this location
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((coach) => (
        <Link key={coach.id} href={`/coaches/${coach.id}`} className="block">
          <Card className="flex items-start gap-2 p-6">
            <Avatar>
              <AvatarImage src={coach.photo_url || ""} />
              <AvatarFallback>
                {coach.name
                  .split(" ")
                  .map((part) => part.at(0)?.toUpperCase())
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{coach.name}</CardTitle>
              <CardDescription>{coach.description}</CardDescription>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

const ActivitiesTab = ({ locationId }: Props) => {
  const user = useUser();

  const { data, loading, error } = useActivities({ location_id: locationId });

  if (loading) {
    return <Skeleton className="w-full h-[150px]" />;
  }

  if (error) {
    return (
      <Alert>
        <ServerCrash className="w-4 h-4" />
        <AlertTitle>Oops, something went wrong</AlertTitle>
        <AlertDescription>
          There was an error during fetching the activities, please try again.
          If the problem persists, please contact the support.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data?.length) {
    return (
      <Alert>
        <UserX className="w-4 h-4" />
        <AlertTitle>No activities</AlertTitle>
        <AlertDescription>
          No activities at this location at the moment. Please come back later.
          {user.role === "admin" && (
            <Button className="w-full mt-2" size="lg" variant="outline">
              Add coach to this location
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((activity) => (
        <Link
          key={activity.id}
          href={`/coaches/${activity.id}`}
          className="block"
        >
          <CardActivity data={activity} />
        </Link>
      ))}
    </div>
  );
};

export const TabsComponent = ({ locationId }: Props) => (
  <Tabs defaultValue="activities" className="w-full">
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="activities">Activities</TabsTrigger>
      <TabsTrigger value="coaches">Coaches</TabsTrigger>
    </TabsList>
    <TabsContent value="activities" className="py-3">
      <ActivitiesTab locationId={locationId} />
    </TabsContent>
    <TabsContent value="coaches" className="py-3">
      <CoachesTab locationId={locationId} />
    </TabsContent>
  </Tabs>
);
