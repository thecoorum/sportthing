import { UserX, ServerCrash } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { CardActivity } from "@/components/ui/activity";

import Link from "next/link";

import { useUser } from "@/hooks/useUser";
import { useEmployees } from "@/hooks/employees";
import { useActivities } from "@/hooks/activities";

type Props = {
  locationId: string;
};

const CoachesTab = ({ locationId }: Props) => {
  const user = useUser();

  const { data, loading, error } = useEmployees({ location_id: locationId });

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
          {user.role === "administrator" && (
            <Link href={{ pathname: "/users", query: { role: "coach" } }}>
              <Button className="w-full mt-2" size="lg" variant="outline">
                Add coach to this location
              </Button>
            </Link>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((employee) => (
        <Link
          key={employee.id}
          href={`/employees/${employee.id}`}
          className="block"
        >
          <Card className="flex items-start gap-2 p-6">
            <Avatar name={employee.user.name} image={employee.user.photo_url} />
            <div>
              <CardTitle className="text-xl">{employee.user.name}</CardTitle>
              {employee.description && (
                <CardDescription>{employee.description}</CardDescription>
              )}
            </div>
          </Card>
        </Link>
      ))}
      {user.role === "administrator" && (
        <Link href={{ pathname: "/users", query: { role: "coach" } }}>
          <Button className="w-full" size="lg" variant="outline">
            Add coach to this location
          </Button>
        </Link>
      )}
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
          {user.role === "administrator" && (
            <Link
              className="block mt-2"
              href={{
                pathname: "/activities/new",
                query: { location_id: locationId },
              }}
            >
              <Button className="w-full" size="lg" variant="outline">
                Add activity to this location
              </Button>
            </Link>
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
          href={`/activities/${activity.id}`}
          className="block"
        >
          <CardActivity data={activity} />
        </Link>
      ))}
      {user.role === "administrator" && (
        <Link
          className="block"
          href={{
            pathname: "/activities/new",
            query: { location_id: locationId },
          }}
        >
          <Button className="w-full" size="lg" variant="outline">
            Add activity to this location
          </Button>
        </Link>
      )}
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
