import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

import type { Tables } from "@/database.extensions";

type Props = {
  data: Tables<"activities"> & {
    coach: Tables<"coaches">;
    location: Tables<"locations">;
  };
};

export const CardActivity = ({ data }: Props) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>{data.name}</CardTitle>
      <CardDescription>{data.location.name}</CardDescription>
      <div className="flex items-center gap-1">
        <CardDescription>
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(data.price / 100)}
        </CardDescription>
        <span className="text-sm text-muted-foreground">•</span>
        <CardDescription>{data.duration} mins</CardDescription>
      </div>
    </CardHeader>
    {data.description && (
      <CardContent>
        <CardDescription>{data.description}</CardDescription>
      </CardContent>
    )}
    {data.coach && (
      <CardFooter className="flex-col items-start space-y-2">
        <CardDescription>This activity is held by:</CardDescription>
        <div className="flex items-center gap-2">
          <Avatar name={data.coach.name} image={data.coach.photo_url} />
          <h2 className="text-lg font-medium">{data.coach.name}</h2>
        </div>
      </CardFooter>
    )}
  </Card>
);

export const PlainActivity = ({ data }: Props) => (
  <div className="space-y-6">
    <div className="space-y-1.5">
      <h2 className="text-3xl font-semibold leading-none tracking-tight">
        {data.name}
      </h2>
      <p className="text-sm text-muted-background">{data.location.name}</p>
      <div className="flex items-center gap-1">
        <p className="text-sm text-muted-background">
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(data.price / 100)}
        </p>
        <span className="text-sm text-muted-background">•</span>
        <p className="text-sm text-muted-background">{data.duration} mins</p>
      </div>
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{data.description}</p>
    </div>
    {data.coach && (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          This activity is held by:
        </p>
        <div className="flex items-center gap-2">
          <Avatar name={data.coach.name} image={data.coach.photo_url} />
          <h2 className="text-lg font-medium">{data.coach.name}</h2>
        </div>
      </div>
    )}
  </div>
);
